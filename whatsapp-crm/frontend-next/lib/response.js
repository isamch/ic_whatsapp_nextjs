import { NextResponse } from 'next/server'

export const ok      = (data, status = 200)  => NextResponse.json({ status: 'success', data }, { status })
export const created = (data)                => ok(data, 201)
export const error   = (message, status = 400) => NextResponse.json({ status: 'error', message }, { status })
