from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
import polars as pl
import dotenv
from datetime import datetime
from database import get_db
from model import Dataset, Crime
from sqlalchemy.orm import Session
from typing import List, Optional
from supabase import create_client, Client
from io import BytesIO
import time
from pydantic import BaseModel

dotenv.load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CrimeResponse(BaseModel):
    id: int
    date_time_occ: str
    crime_code_desc: str
    location: str
    area_name: str
    status_desc: str
    lat: Optional[float]
    lon: Optional[float]
    part_1: bool


@app.post("/upload-dataset")
async def upload(file: UploadFile = File(...), db: Session = Depends(get_db)):
    dataset_id = await process(file, db)
    return {
        "success": True,
        "datasetId": str(dataset_id),
        "message": "Dataset uploaded and processed successfully",
    }


async def process(file: UploadFile, db: Session):
    # Handle ingestion, cleaning, and basic transformation of the data
    start_time = time.time()
    try:
        print(f"\nStarting ingestion of file: {file.filename}")
        storage_path = f"datasets/{file.filename}"

        # Check if dataset already exists
        existing_dataset = (
            db.query(Dataset).filter(Dataset.file_path == storage_path).first()
        )

        if existing_dataset:
            raise HTTPException(
                status_code=400,
                detail=f"Dataset {file.filename} has already been uploaded",
            )

        # Create dataset entry first
        dataset = Dataset(
            created_at=datetime.now(),
            file_path=storage_path,
        )
        db.add(dataset)
        db.flush()
        print("Dataset entry created in database")

        # Read the CSV file with Polars
        print("Reading CSV file with Polars...")
        file_content = await file.read()
        df = pl.read_csv(BytesIO(file_content))
        print(f"Total records in CSV: {df.height:,}")

        # Sample the first date to determine format
        first_date_rptd = df["Date Rptd"][0]
        first_date_occ = df["DATE OCC"][0]

        print(
            f"Detected date formats - Date Rptd: {first_date_rptd}, DATE OCC: {first_date_occ}"
        )

        # Convert date columns based on detected format
        try:
            if "-" in first_date_rptd:  # Format: YYYY-MM-DD
                df = df.with_columns(
                    [
                        pl.col("Date Rptd").str.strptime(pl.Date, "%Y-%m-%d"),
                        pl.col("DATE OCC").str.strptime(pl.Date, "%Y-%m-%d"),
                    ]
                )
            else:  # Format: MM/DD/YYYY HH:MM:SS AM/PM
                df = df.with_columns(
                    [
                        pl.col("Date Rptd").str.strptime(
                            pl.Date, "%m/%d/%Y %I:%M:%S %p"
                        ),
                        pl.col("DATE OCC").str.strptime(
                            pl.Date, "%m/%d/%Y %I:%M:%S %p"
                        ),
                    ]
                )
        except Exception as e:
            print(f"Error parsing dates: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Failed to parse dates. Please ensure dates are in YYYY-MM-DD or MM/DD/YYYY HH:MM:SS AM/PM format",
            )

        # Filter for 2024 data
        df_2024 = df.filter(pl.col("DATE OCC").dt.year() == 2024)
        print(f"Found {df_2024.height:,} records from 2024")

        # Process entire dataframe with vectorized operations
        processed_df = df_2024.with_columns(
            [
                pl.col("TIME OCC")
                .cast(pl.Int64)
                .cast(pl.Utf8)
                .str.pad_start(4, "0")
                .alias("time_str"),
                # Convert part 1-2 to boolean
                (pl.col("Part 1-2") == 1).alias("is_part_1"),
                # Handle numeric columns that might be null
                pl.col("Vict Age").cast(pl.Int64, strict=False),
                pl.col("AREA").cast(pl.Int64),
                pl.col("Crm Cd").cast(pl.Utf8),
                pl.col("Rpt Dist No").cast(pl.Utf8),
                pl.col("Premis Cd")
                .cast(pl.Int64, strict=False)
                .cast(pl.Utf8, strict=False),
                pl.col("Crm Cd 1")
                .cast(pl.Int64, strict=False)
                .cast(pl.Utf8, strict=False),
                pl.col("Crm Cd 2")
                .cast(pl.Int64, strict=False)
                .cast(pl.Utf8, strict=False),
                pl.col("Crm Cd 3")
                .cast(pl.Int64, strict=False)
                .cast(pl.Utf8, strict=False),
                pl.col("Crm Cd 4")
                .cast(pl.Int64, strict=False)
                .cast(pl.Utf8, strict=False),
                pl.col("LAT").cast(pl.Float64, strict=False),
                pl.col("LON").cast(pl.Float64, strict=False),
                pl.lit(datetime.now()).alias("created_at"),
            ]
        )

        # Create the final DataFrame with correct column names and types
        db_ready_df = processed_df.select(
            [
                pl.lit(dataset.id).alias("dataset"),
                pl.col("DR_NO").alias("dr_no"),
                pl.col("Date Rptd").alias("date_rptd"),
                (
                    pl.col("DATE OCC")
                    .cast(pl.Date)
                    .dt.combine(pl.col("time_str").str.strptime(pl.Time, "%H%M"))
                ).alias("date_time_occ"),
                pl.col("time_str").str.strptime(pl.Time, "%H%M").alias("time_occ"),
                pl.col("AREA").alias("area_id"),
                pl.col("AREA NAME").alias("area_name"),
                pl.col("Rpt Dist No").alias("rpt_dist_no"),
                pl.col("is_part_1").alias("part_1"),
                pl.col("Crm Cd").alias("crime_code"),
                pl.col("Crm Cd Desc").alias("crime_code_desc"),
                pl.col("Mocodes").alias("mocodes"),
                pl.col("Vict Age").alias("vict_age"),
                pl.col("Vict Sex").alias("vict_sex"),
                pl.col("Vict Descent").alias("vict_descent"),
                pl.col("Premis Cd").alias("premis_cd"),
                pl.col("Premis Desc").alias("premis_desc"),
                pl.col("Weapon Used Cd").alias("weapon_used_cd"),
                pl.col("Weapon Desc").alias("weapon_desc"),
                pl.col("Status").alias("status"),
                pl.col("Status Desc").alias("status_desc"),
                pl.col("Crm Cd 1").alias("crm_cd_1"),
                pl.col("Crm Cd 2").alias("crm_cd_2"),
                pl.col("Crm Cd 3").alias("crm_cd_3"),
                pl.col("Crm Cd 4").alias("crm_cd_4"),
                pl.col("LOCATION").alias("location"),
                pl.col("Cross Street").alias("cross_street"),
                pl.col("LAT").alias("lat"),
                pl.col("LON").alias("lon"),
                pl.col("created_at"),
            ]
        )

        # Convert to records for database insertion
        records = db_ready_df.to_dicts()

        # Bulk insert using SQLAlchemy Core
        print("\nPerforming bulk insertion...")
        db.execute(Crime.__table__.insert(), records)
        db.commit()

        total_time = time.time() - start_time
        print(f"\nProcessing completed in {total_time:.1f} seconds")
        print(f"Total records processed: {len(records):,}")
        print(
            f"Average processing speed: {len(records) / total_time:.0f} records/sec\n"
        )

        # Return the dataset id
        return dataset.id

    except Exception as e:
        print(f"\nError occurred: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


async def detect():
    pass


@app.get("/datasets/{dataset_id}")
async def get_dataset(dataset_id: str, db: Session = Depends(get_db)):
    try:
        dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found")

        # Get basic stats about the dataset
        crime_count = db.query(Crime).filter(Crime.dataset == dataset.id).count()

        return {
            "dataset": {
                "id": str(dataset.id),
                "name": os.path.basename(dataset.file_path),
                "createdAt": dataset.created_at.isoformat(),
                "rowCount": crime_count,
                "columnCount": 30,  # Hardcoded for now since we know our schema
            }
        }
    except Exception as e:
        print(f"\nError occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/datasets/{dataset_id}/crimes")
async def get_crimes(
    dataset_id: str,
    page: int = 1,
    page_size: int = 10,
    search: str = "",
    start_date: str = "2024-01-01",
    end_date: str = "2024-12-31",
    db: Session = Depends(get_db),
):
    try:
        # Calculate offset
        offset = (page - 1) * page_size

        # Start building the query
        query = db.query(Crime).filter(Crime.dataset == dataset_id)

        # Apply date range filter
        query = query.filter(
            Crime.date_time_occ >= start_date,
            Crime.date_time_occ <= end_date + " 23:59:59",
        )

        # Apply search filter if provided
        if search:
            search = f"%{search}%"
            query = query.filter(
                (Crime.location.ilike(search))
                | (Crime.crime_code_desc.ilike(search))
                | (Crime.area_name.ilike(search))
            )

        # Get total count for pagination
        total_count = query.count()

        # Get paginated results
        crimes = (
            query.order_by(Crime.date_time_occ).offset(offset).limit(page_size).all()
        )

        # Convert to response format
        results = [
            CrimeResponse(
                id=crime.id,
                date_time_occ=crime.date_time_occ.isoformat()
                if crime.date_time_occ
                else None,
                crime_code_desc=crime.crime_code_desc,
                location=crime.location,
                area_name=crime.area_name,
                status_desc=crime.status_desc,
                lat=crime.lat,
                lon=crime.lon,
                part_1=crime.part_1,
            )
            for crime in crimes
        ]

        return {
            "data": results,
            "total": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_count + page_size - 1) // page_size,
        }

    except Exception as e:
        print(f"\nError occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
