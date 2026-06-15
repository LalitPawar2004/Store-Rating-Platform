export default function StarRating({value, onChange}){
  return (
    <div>
      {[1,2,3,4,5].map(n=>(
        <button key={n} onClick={()=>onChange(n)} style={{color:n<=value?'gold':'#ccc', background:'none', border:'none', fontSize:'20px', cursor:'pointer'}}>★</button>
      ))}
    </div>
  )
}
