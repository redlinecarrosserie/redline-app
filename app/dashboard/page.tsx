'use client'

import Link from 'next/link'

import { useEffect, useState } from 'react'

import { supabase } from '../../lib/supabaseClient'

type Vehicle = {

  id: string

  plate: string

  brand: string | null

  model: string | null

  status: string

}

export default function Dashboard() {

  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadVehicles() {

      const { data } = await supabase

        .from('vehicles')

        .select('id, plate, brand, model, status')

