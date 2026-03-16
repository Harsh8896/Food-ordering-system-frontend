import React, { useEffect, useState } from 'react'
import PublicLayout from '../components/PublicLayout'
import { Link, useLocation } from 'react-router-dom'
import { FaCartArrowDown } from 'react-icons/fa'
import "../App.css"


const SearchPage = () => {
  const query = new URLSearchParams(useLocation().search).get('q') || "";
  const [foods, setFoods] = useState([])


   useEffect(()=>{
              if(query){
                fetch(`http://127.0.0.1:8000/api/food_search/?q=${query}`)
              .then(res => res.json())
              .then(data => {
                console.log("API DATA:", data)
                  setFoods(data)
              })
              }
          },[query])
  return (
    <PublicLayout>
      <div className='container py-4'>
        <h3 className='text-primary text-center'>Result for: {query}</h3>
        <div className='row mt-4'>
          {foods.length === 0 ? (
            <p className='text-center'>No foods found</p>
          ) : (
            foods.map((item)=>(
              <div className='col-md-4 mb-4'>
                  <div className='card hovereffect'>
                    <img src={`http://127.0.0.1:8000/${item.image}`} className='card-img-top object-fit-fill' alt="" style={{height:"210px"}} />
                    <div className='card-body'>
                      <h5 className='card-title'>
                        <Link to="#">{item.item_name}</Link>
                      </h5>
                      <p className='card-text text-muted'>{item.item_description.slice(0, 50)}...</p>
                      <div className='d-flex justify-content-between align-items-center'>
                    <span className='fw-bold'>₹ {item.item_price}</span>
                    {
                      item.is_available ? (
                        <Link className='btn btn-warning btn-sm text-white d-flex align-items-center'><FaCartArrowDown className='me-2'/> Order now</Link>
                      ) : (
                        <div title='This food item is not available right now. Please try again later.'>
                          <button className='btn btn-outline-primary btn-sm d-flex align-items-center'> Currently Unavailable</button>
                        </div>
                      )
                    }
                    {
                      console.log(foods)
                    }
                    
                      </div>
                    </div>
                  </div>
            </div>
            ))
          )}
            
        </div>
      </div>
    </PublicLayout>
  )
}

export default SearchPage