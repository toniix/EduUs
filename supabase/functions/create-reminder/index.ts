// supabase/functions/create-reminder/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateReminderRequest {
  userId: string
  opportunityId: string
  reminderTypes: string[]
}

serve(async (req) => {
  // Manejar CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método no permitido' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      }
    )
  }

  try {
    // Inicializar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parsear el body de la request
    const { userId, opportunityId, reminderTypes = ['7', '3', '1'] }: CreateReminderRequest = await req.json()

    // Validaciones básicas
    if (!userId || !opportunityId) {
      throw new Error('userId y opportunityId son requeridos')
    }

    console.log(`Creando recordatorios para usuario ${userId}, oportunidad ${opportunityId}`)

    // Verificar que la oportunidad existe
    const { data: opportunity, error: oppError } = await supabaseClient
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single()

    if (oppError) {
      console.error('Error obteniendo oportunidad:', oppError)
      throw new Error('Oportunidad no encontrada')
    }

    if (!opportunity) {
      throw new Error('Oportunidad no encontrada')
    }

    console.log(`Oportunidad encontrada: ${opportunity.title}`)

    // Verificar si ya existen recordatorios para esta combinación
    const { data: existingReminders } = await supabaseClient
      .from('reminders')
      .select('id, reminder_type')
      .eq('user_id', userId)
      .eq('opportunity_id', opportunityId)

    if (existingReminders && existingReminders.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Ya tienes recordatorios configurados para esta oportunidad',
          existingReminders: existingReminders
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Crear recordatorios basados en la fecha límite
    const deadline = new Date(opportunity.deadline)
    const now = new Date()

    console.log(`Fecha límite: ${deadline.toISOString()}`)
    console.log(`Fecha actual: ${now.toISOString()}`)

    const reminders = reminderTypes.map(days => {
      const reminderDate = new Date(deadline)
      reminderDate.setDate(deadline.getDate() - parseInt(days))
      reminderDate.setHours(9, 0, 0, 0) // Enviar a las 9 AM
      
      return {
        user_id: userId,
        opportunity_id: opportunityId,
        reminder_date: reminderDate.toISOString(),
        reminder_type: `${days}_days`,
        status: 'pending'
      }
    }).filter(reminder => {
      const reminderDate = new Date(reminder.reminder_date)
      return reminderDate > now // Solo recordatorios futuros
    })

    console.log(`Recordatorios a crear: ${reminders.length}`)

    if (reminders.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No se pueden crear recordatorios para fechas pasadas. La oportunidad puede haber vencido.' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Insertar recordatorios en la base de datos
    const { data, error } = await supabaseClient
      .from('reminders')
      .insert(reminders)
      .select()

    if (error) {
      console.error('Error insertando recordatorios:', error)
      throw new Error(`Error creando recordatorios: ${error.message}`)
    }

    console.log(`${data.length} recordatorios creados exitosamente`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${data.length} recordatorios configurados exitosamente`,
        reminders: data.map(r => ({
          id: r.id,
          reminderDate: r.reminder_date,
          reminderType: r.reminder_type
        }))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error en create-reminder:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Error interno del servidor' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})