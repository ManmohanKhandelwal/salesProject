import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(request) {
  try {
    // Example mock data, replace with real DB call or query param parsing
    const body = await request.json();
    const { data } = body; // Assuming data is passed in the request body

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No data found." }, { status: 400 });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Top Stores");

    const fixedKeys = [
      "store_code",
      "store_name",
      "branch_name",
      "customer_type",
      "channel",
      "total_retailing",
      "avg_retailing",
    ];

    const allKeys = Object.keys(data[0] || {});
    const monthKeys = allKeys.filter((key) => !fixedKeys.includes(key));

    const sortedMonthKeys = monthKeys.sort((a, b) => {
      const parseDate = (key) => {
        const [monthStr, year] = key.split("_");
        return new Date(`${monthStr} 1, ${year}`);
      };
      return parseDate(a) - parseDate(b);
    });

    worksheet.columns = [
      { header: "Store Code", key: "store_code", width: 15 },
      { header: "Store Name", key: "store_name", width: 25 },
      { header: "Branch Name", key: "branch_name", width: 20 },
      { header: "Customer Type", key: "customer_type", width: 15 },
      { header: "Channel", key: "channel", width: 15 },
      ...sortedMonthKeys.map((month) => ({
        header: month.replace("_", " ").toUpperCase(),
        key: month,
        width: 20,
      })),
      { header: "Total Retailing", key: "total_retailing", width: 20 },
      { header: "Avg Retailing", key: "avg_retailing", width: 20 },
    ];

    data.forEach((row) => {
      worksheet.addRow(row);
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Top_Stores_${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Excel generation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
