'use client'

import Link from 'next/link'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { supabase } from '@/lib/supabaseClient'

export default function VehiclePage() {

  const params = useParams()

  const id = params.id as string

  const [vehicle, setVehicle] = useState<any>(null)

  const [tasks, setTasks] = useState<any[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadVehicle() {

      const { data: vehicleData } = await supabase

        .from('vehicles')

        .select('*')

        .eq('id', id)

        .single()

      const { data: taskData } = await supabase
