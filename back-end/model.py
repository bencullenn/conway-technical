from sqlalchemy import (
    Boolean,
    Column,
    BigInteger,
    Text,
    TIMESTAMP,
    ForeignKey,
    Float,
    Date,
    Time,
)
from database import Base


class Dataset(Base):
    __tablename__ = "dataset"
    id = Column(BigInteger, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True))
    file_path = Column(Text)


class Crime(Base):
    __tablename__ = "crime"
    id = Column(BigInteger, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True))
    dataset = Column(BigInteger, ForeignKey("dataset.id"))
    dr_no = Column(Text)
    date_rptd = Column(Date)
    date_time_occ = Column(TIMESTAMP(timezone=False))
    time_occ = Column(Time)
    area_id = Column(BigInteger)
    area_name = Column(Text)
    rpt_dist_no = Column(Text)
    part_1 = Column(Boolean)
    crime_code = Column(Text)
    crime_code_desc = Column(Text)
    mocodes = Column(Text)
    vict_age = Column(BigInteger)
    vict_sex = Column(Text)
    vict_descent = Column(Text)
    premis_cd = Column(Text)
    premis_desc = Column(Text)
    weapon_used_cd = Column(Text)
    weapon_desc = Column(Text)
    status = Column(Text)
    status_desc = Column(Text)
    crm_cd_1 = Column(Text)
    crm_cd_2 = Column(Text)
    crm_cd_3 = Column(Text)
    crm_cd_4 = Column(Text)
    location = Column(Text)
    cross_street = Column(Text)
    lat = Column(Float)
    lon = Column(Float)
