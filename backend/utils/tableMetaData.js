
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
    years: "YEAR(pd.document_date)",
    months: "MONTH(pd.document_date)",
    category: "pd.category",
    brand: "pd.brand",
    brandform: "pd.brandform",
    subBrandform: "pd.subbrandform_name",
    customer_type: "pd.customer_type",
    branches: "store_mapping.New_Branch",
    zm: "store_mapping.ZM",
    sm: "store_mapping.SM",
    be: "store_mapping.BE",
    channel: "channel_mapping.channel",
    broadChannel: "channel_mapping.broad_channel",
    shortChannel: "channel_mapping.short_channel",
};
export { monthMapping, formattedQueryKeys };