'use client'


import { useState, useEffect } from "react"
import WhatsAppRequired from '@/components/WhatsAppRequired'



export default function TestUsersPage() {


  const [users, setUsers] = useState([])



  useEffect(() => {

    // fetch('https://api.github.com/users').then((res) => {

    //   setUsers(await res.json());

    //   console.log(res.json());
    // })


    async function getUsers() {
      let res = await fetch('https://api.github.com/users')

      setUsers(await res.json());

      // setUsers(["test","t"])


    }

    getUsers()

    // setUsers(await res.json());



  }, []);



  useEffect(() => {

    console.log(users)

  }, [users]);


  return (



        <div className="flex-1 flex items-center justify-center h-full">


          {

            users.map((user) => {
              <p key={user.id}>
                user.login
              </p>


            })

          }


        </div>


        );



}


