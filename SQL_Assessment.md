## SQL Bonus Assessment

### Q1. Write a query to return the current designation of every employee — defined as the designation from their most recent effective_date.

For this question, I need to get the latest designation of each employee. Since an employee can have multiple designation records as the time pasts, so I sorted their records by **_effective_date_** from the newest to the oldest. Then I used **_ROW_NUMBER()_** and took the row where the number is **_1_**.

```sql
SELECT emp_id, emp_name, designation AS current_designation
FROM (SELECT emp_id, emp_name, designation, ROW_NUMBER() OVER (
    PARTITION BY emp_id
    ORDER BY effective_date DESC
) as rn
FROM emp_designation_log
) t
WHERE rn = 1;
```

#### Example:

```
For Alice:
2024-02-01 -> Associate Developer
2024-02-05 -> Mid Developer
2024-02-10 -> Senior Developer

Since, the latest date is 2024-02-10, hence her current designation is:

EMP001 | Alice Johnson | Senior Developer
```

### Q2. Write a query that returns, for every row in the table:

### emp_id | effective_date | previous_designation | designation | next_designation

#### Where previous_designation is the designation held just before this row (for the same employee), and next_designation is the one that comes after. Return NULL where there is no previous or next.

For this question, I need to find the designation before and after each row. I have used **_LAG()_** for the previous designation and **_LEAD()_** for the next designation.
I have used **_PARTITION BY emp_id_** so that I only compare the designations that belongs to the same employee.

```sql
SELECT emp_id, effective_date, LAG(designation) OVER (
    PARTITION BY emp_id ORDER BY effective_date, txn_id
) AS previous_designation, designation, LEAD(designation) OVER (
    PARTITION BY emp_id ORDER BY effective_date, txn_id
) AS next_designation
FROM emp_designation_log
ORDER BY emp_id, effective_date, txn_id;
```

#### Example:

```
For Alice:
2024-02-01 -> Associate Developer
2024-02-05 -> Mid Developer
2024-02-10 -> Senior Developer

So the final result would be:
2024-02-01 | NULL | Associate Developer | Mid Developer
2024-02-05 | Associate Developer | Mid Developer | Senior Developer
2024-02-10 | Mid Developer | Senior Developer | NULL
```

Here, the first row has **NULL** for the previous designation because there is nothing before that designation. The last row also has **NULL** for the next designation because there is no designation after it.

### Q3. Write a query using both tables to produce the following output:

### allocation_id | emp_id | emp_name | project_name | allocated_role | allocation_start | designation_at_allocation

For this question, I need to find which designation the employee had when the project allocation was started.

At first, I matched the records using **_emp_id_**. Then only I considered designations where following condition meets:

**_effective_date <= allocation_start_**

Evemn if there are multiple designations, I used the one which has the latest **_effective_date_**.

I used a **_LEFT_JOIN_** because an employee might not have any designation record before the allocation date. For that case, the designation should be **_NULL_**.

```sql
SELECT a.allocation_id, a.emp_id, d.emp_name, a.project_name, a.allocated_role, a.allocation_start, d.designation AS designation_at_allocation
FROM emp_allocation_log a
LEFT JOIN emp_designation_log d
ON a.emp_id = d.emp_id
AND d.effective_date <= a.allocation_start
WHERE NOT EXISTS (
    SELECT 1 FROM emp.designation_log d2
    WHERE d2.emp_id = a.emp_id
    AND d2.effective_date <= a.allocation_start
    AND (
        d2.effective_date > d.effective_date
        OR (
            d2.effective_date = d.effective_date
            AND d2.txn_id > d.txn_id
        )
    )
);
```

#### Example:

```
For Alice:
2024-02-01 -> Associate Developer
2024-02-05 -> Mid Developer
2024-02-10 -> Senior Developer

Alice's Alpha project allocation was started on:
2024-02-03

At that date, Alice was still an Associate Developer

Hence, 2024-02-05 and 2024-02-10 records are simply ignored because those designations started after the project allocation.

Hence, the result is:
A001 | EMP001 | Alice Johnson | Project Alpha | Developer | 2024-02-03 | Associate Developer

```
