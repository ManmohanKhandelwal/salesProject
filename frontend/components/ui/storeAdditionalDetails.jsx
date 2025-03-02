import React from 'react'

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];

const StoreAdditionalDetails = ({data}) => {
    console.log(data)
  return (
    <div className='grid grid-rows-8 gap-3'>
      <div className='p-3 flex justify-between bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-lg text-lg tracking-wide'><p>Highest Retailing Month</p><p>{months[data.highest_retailing_month.split("-")[1]-1]+" "+data.highest_retailing_month.split("-")[0]}</p></div>
      <div className='p-3 flex justify-between bg-gradient-to-t from-amber-500 to-amber-300 rounded-lg text-lg tracking-wide'><p>Highest Retailing Amount</p><p>₹ {Number(data.highest_retailing_amount) > 100000 ? String((Number(data.highest_retailing_amount)/1000).toFixed(2))+"K":data.highest_retailing_amount}</p></div>
      <div className='p-3 flex justify-between bg-gradient-to-t from-lime-500 to-lime-300 rounded-lg text-lg tracking-wide'><p>Lowest Retailing Month</p><p>{months[data.lowest_retailing_month.split("-")[1]-1]+" "+data.lowest_retailing_month.split("-")[0]}</p></div>
      <div className='p-3 flex justify-between bg-gradient-to-t from-green-500 to-green-300 rounded-lg text-lg tracking-wide'><p>Lowest Retailing Amount</p><p>₹ {Number(data.lowest_retailing_amount) > 100000 ? String((Number(data.lowest_retailing_amount)/1000).toFixed(2))+"K":data.lowest_retailing_amount}</p></div>
      <div className='p-3 flex justify-between bg-gradient-to-t from-fuchsia-500 to-fuchsia-300 rounded-lg text-lg tracking-wide'><p>Highest Retailing Product</p><p>{data.highest_retailing_product}</p></div>
      <div className='p-3 flex justify-between bg-gradient-to-t from-orange-500 to-orange-300 rounded-lg text-lg tracking-wide'><p>Highest Retailing Product Amount</p><p>₹ {Number(data.highest_retailing_product_amount) > 100000 ? String((Number(data.highest_retailing_product_amount)/1000).toFixed(2))+"K":data.highest_retailing_product_amount}</p></div>
      <div className='p-3 flex justify-between bg-gradient-to-t from-red-500 to-red-300 rounded-lg text-lg tracking-wide'><p>Lowest Retailing Product</p><p>{data.lowest_retailing_product}</p></div>
      <div className='p-3 flex justify-between bg-gradient-to-t from-blue-500 to-blue-300 rounded-lg text-lg tracking-wide'><p>Highest Retailing Product Amount</p><p>₹ {Number(data.lowest_retailing_product_amount) > 100000 ? String((Number(data.lowest_retailing_product_amount)/1000).toFixed(2))+"K":data.lowest_retailing_product_amount}</p></div>
    </div>
  )
}

export default StoreAdditionalDetails