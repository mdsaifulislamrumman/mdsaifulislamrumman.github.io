# Excel Sales Performance Dashboard

**Type:** Excel data analysis & dashboard design
**Folder:** `projects/excel-dashboard/`

## Files

| File | Description |
|---|---|
| `sales_data.xlsx` | Source dataset — one sheet (`Data`) with 2,000 order records and 12 fields |
| `dashboard.xlsm` | Macro-enabled Excel workbook with the sheets `Dashboard`, `Pivot_Table` and `Sales_Data` |
| `preview.png` | Screenshot of the dashboard (2:1 ratio) used on the website |
| `sales_summary.csv` | Aggregated revenue totals (by month, region, product category, sales channel and top 5 products) calculated from `sales_data.xlsx`; feeds the Chart.js view on the Projects page |

## Dataset fields

Order ID · Date · Region · Sales Channel · Customer Type · Product Category · Product · Salesperson · Quantity · Unit Price · Discount · Revenue

## What the dashboard contains

- KPI cards: Total Revenue, Total Orders, Quantity Sold, Average Order
- Slicers: Region, Product Category, Customer Type, Sales Channel
- Date timelines (years, quarters, months, days)
- Charts: Revenue by Month, Region, Product Category and Sales Channel; Top 5 Products by Revenue

## Notes

- No business conclusions or outcomes are claimed on the website for this project. Add findings here only after you have verified them.
- `sales_summary.csv` columns: `dimension,label,revenue` (USD). To refresh it after changing the dataset, re-aggregate `Revenue` by each dimension.
