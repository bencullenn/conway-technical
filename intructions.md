# Conway Interview Take-Home Assignment

Thank you for participating in our interview process!

---

## General Guidelines

- **Time Expectation**: Plan to spend 3–4 hours on this assignment. We do not expect a production-ready solution, but we do value a thoughtful, well-structured approach.
- **Submission**:
  - Submit your code as a GitHub repository (or alternative VCS hosting service).
  - Provide clear instructions on how to run your application (a simple "Getting Started" section with all necessary steps).
- **Documentation**:
  - Include a **well-structured README** that explains your approach:
    - The technologies/patterns/frameworks you chose.
    - How to run/test the application.
    - Any design decisions or trade-offs made.
- **Evaluation Criteria**:

  - **Functionality**: Does the application work as intended according to the requirements?
  - **Code Quality**: Is the code easy to read, well-organized, modular, and maintainable? Are there any obvious errors or inefficiencies?
  - **Architecture**: Is the overall structure of the solution coherent and extensible?
  - **Documentation & Clarity**: Are the setup steps clear? Are the trade-offs and assumptions adequately explained?
  - **Error Handling & Edge Cases**: Does the solution gracefully handle unexpected input or other issues?
  - **Testing (Bonus)**: If you include tests, do they demonstrate coverage of critical functions or workflows?

- **Questions**: If any aspect of the assignment is unclear, please text Anne at +1 (917) 833-9231.

---

## Your Task

Choose **ONE** of the two options below. Each option allows you to build something interactive while showcasing your chosen tech stack, your coding style, and your approach to problem solving.

### Option 1: Work with Government Data

Create a **full-stack application** that allows a user to find anomalies in your choice of a public dataset from [data.gov](https://data.gov/).

1. **Dataset Selection**:

   - Choose a dataset from `data.gov` that you find interesting or relevant.
   - **Explain** why you chose this dataset (in your README).

2. **Data Processing**:

   - Implement backend logic to process and analyze the data.
   - Provide a brief explanation (in your README or code comments) describing your **definition of "anomaly"** in the context of the chosen dataset.

3. **Backend**:

   - Use any server-side language or framework you're comfortable with (e.g., Python/Flask, Node/Express, Ruby on Rails, etc.).
   - Consider your architecture for handling data ingestion, cleaning, transformation, and anomaly detection.

4. **Frontend**:

   - Use a modern JavaScript framework (React, Vue, Angular, etc.).
   - Visualize the data in a clear, interactive manner (e.g., charts, tables, dynamic elements).
   - Highlight anomalies (or suspicious data points) and allow the user to **filter** or **interact** with the dataset.

5. **Data Storage**:

   - You may choose any storage solution (relational/NoSQL/Postgres/SQLite/file-based) as appropriate.
   - If relevant, integrate or briefly describe how your chosen database interacts with the data.

6. **User Interaction**:
   - Include at least one feature that lets users dynamically filter, sort, or query the data to focus on potential anomalies.

---

### Option 2: Build a File Selector

Implement a **naive file selector system** that can enhance the context in a user query or complaint. The system should identify and retrieve relevant files from a repository based on user queries, scoring how "pertinent" the file content is.

1. **Sample Repository**:

   - Create a repository of **at least 20 files** with varied topics (e.g., different products, documentation, logs, random content).
   - Files can be in multiple formats (text, markdown, config, etc.) or in a single format.

2. **Relevance Scoring**:

   - Implement at least two different strategies to rank how likely a file is relevant to a given query.
     - Examples: _TF-IDF_, _cosine similarity_, _keyword match with weighting_, etc.

3. **Interface**:

   - Build a simple search/interrogation interface where a user can type a query or complaint and see a list of matching files.
   - Indicate the "relevance score" or ranking for each returned file.

4. **Threshold Mechanism**:

   - Provide an option for the user to set or adjust a relevance threshold.
   - Files below the threshold are _not_ included in the "selected context."

5. **View Selected Context**:

   - Display the text or relevant snippet of each selected file so users can see _why_ it was pulled in.

6. **Implementation Details**:
   - You may choose any language/framework (if you prefer scripting in Python, a Node web app, etc.).
   - Clearly explain in your README:
     - Your approach to calculating relevance.
     - How you might refine or improve your algorithm given more time.

---

## Extra Credit (Optional, but Appreciated)

- **Unit Tests**: Provide tests for critical parts of your code (anomaly detection, relevance ranking, or other logic).
- **Performance Considerations**: Briefly discuss if (and how) your solution scales to larger data sets or more complex queries.
- **Creative Extensions**: For example, using advanced data visualization libraries, adding authentication/authorization, or including additional search operators (wildcards, partial matches, synonyms, etc.).
- **Edge Case Handling**: Demonstrate thoughtful handling of potential pitfalls (e.g., empty datasets, missing files, special characters).

---

## Final Notes

The goal of this assignment is not only to see a working application but to gain insight into how you approach real-world coding tasks:

- How do you structure your project?
- How do you approach solving a specific problem with a given set of tools?
- How do you handle less-defined features and turn them into coherent solutions?

Thank you for your time and effort! We're excited to see your solution.
