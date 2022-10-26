'use client'

export default function DateComp({date, onClick}) {
  console.log(date);
  
  return (
    <div onClick={onClick}>
      {date}
    </div>
  );
}
