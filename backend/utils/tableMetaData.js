
// Month Name -> Month Number Mapping
const monthMapping = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
};

// Mapping frontend filter keys to corresponding DB columns
const formattedQueryKeys = {
    year: "YEAR(psr_data.document_date)",
    month: "MONTH(psr_data.document_date)",
    category: "psr_data.category",
    brand: "psr_data.brand",
    brandform: "psr_data.brandform",
    subBrandform: "psr_data.subbrandform_name",
    customerType: "psr_data.customer_type",
    branch: "store_mapping.New_Branch",
    zoneManager: "store_mapping.ZM",
    salesManager: "store_mapping.SM",
    branchExecutive: "store_mapping.BE",
    channel: "channel_mapping.channel",
    broadChannel: "channel_mapping.broad_channel",
    shortChannel: "channel_mapping.short_channel",
};
export { monthMapping, formattedQueryKeys };