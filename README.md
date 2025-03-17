# conway-technical

## Dataset

I chose to analyze the [data.gov](https://data.gov/) dataset on [Los Angeles Crime](https://catalog.data.gov/dataset/crime-data-from-2020-to-present). I chose this dataset because it has a large amount of data and is more interesting than just finding abnormal trends something like air quality.

Due to the scope of this project, I decided to define an abnormality as crimes that occur in an area more often than usual. I used the z-score to determine if a crime is occurring more often than usual.

## Setup Instructions

### Environment Variables

1. **Import Environment Files**  
   You will need to use the environment files provided via email:

   - For the back-end: Add the `.env` file in the `back-end` directory that includes the database connection string.
   - For the front-end: Add the `.env` file in the `front-end` directory that includes the backend api url.

   These files contain necessary configuration for database connections and API endpoints.

### Back-End

1. **Install UV**  
   If you don't have UV installed, you can install it by following the instructions [here](https://github.com/astral-sh/uv#installation).
2. **Sync Dependencies**  
   Run the following command to install all dependencies:

   ```sh
   uv sync
   ```

3. **Start the FastAPI Server**  
   Run the following command to start the back-end:
   ```sh
   uv run FastAPI dev main.py
   ```
   Once this command runs successfully, the back-end should be up and running.

### Front-End

1. **Navigate to the Front-End Directory**

   ```sh
   cd front-end
   ```

2. **Install Dependencies**

   ```sh
   npm i
   ```

3. **Start the Front-End Server**
   ```sh
   npm run dev
   ```
   The front-end should now be running at http://localhost:3000.

## Approach

### Technologies Used

#### Back-End

I chose FastAPI because it is lightweight, easy to set up, and provides built-in support for asynchronous operations with AsyncIO. It allows for fast and efficient API endpoint creation while maintaining high performance with multiple concurrent requests.

#### Front-End

I used Next.js with ShadCN and TailwindCSS. This stack provides a balance between rapid development and customization, with built-in styling capabilities and the option to use server-side rendering (SSR) for improved performance.

### Design Decisions & Trade-Offs

#### Front-End

One major design decision was to split the app into two separate pages. While this added some complexity, it provided the following benefits:

- Allowed dataset state to be preserved through URL links.
- Enabled easier testing by allowing page refreshes without losing dataset state.
- Makes it possible to share dataset links directly with others which might be useful for collaboration.

#### Back-End

**SQL vs. NoSQL Database**

- I chose PostgreSQL over a NoSQL database because it allowed for structured querying and data analysis directly in the database.
- While this decision worked well for this project, in a production environment, I might consider using a NoSQL database or leveraging PostgreSQL's JSON capabilities for more flexible dataset handling. This would allow for this application to be used with a wider variety of datasets.

**Data Processing in the Database vs. Back-End**

- Instead of processing data in-memory on the back-end, I opted to handle it directly in the SQL database.
- This improved performance by avoiding the need to load large datasets into memory and allowed for more efficient querying.

**Filtering Data to 2024**

- To optimize analysis and reduce dataset size, I limited the data to 2024.
- This decision simplified uploads and improved query performance.

By making these trade-offs, I optimized the project for its specific use case while keeping it maintainable and scalable for potential future improvements.
