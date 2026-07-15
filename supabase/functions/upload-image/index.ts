import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Tamaño máximo: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024
// Tipos de archivo permitidos
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

serve(async (req) => {
  // Manejar preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: corsHeaders
    })
  }

  try {
    // Verificar autenticación del usuario
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Se requiere autenticación' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Configuración de Cloudinary desde variables de entorno del servidor
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY')
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')

    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({ success: false, error: 'Cloudinary credentials not configured on server' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validar Content-Type antes de parsear
    const contentType = req.headers.get('Content-Type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Content-Type debe ser multipart/form-data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parsear el FormData de la request
    let formData
    try {
      formData = await req.formData()
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'No se pudo parsear el formulario. Asegúrate de enviar un archivo válido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const file = formData.get('file')

    if (!file || typeof file === 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'No se proporcionó ningún archivo' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Tipo de archivo no permitido: ${file.type}. Tipos permitidos: ${ALLOWED_TYPES.join(', ')}`
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validar tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `El archivo excede el tamaño máximo de ${MAX_FILE_SIZE / (1024 * 1024)}MB`
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generar signature firmada para upload seguro
    const timestamp = Math.round(Date.now() / 1000)
    const folder = 'opportunities'
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
    const signature = await generateSignature(stringToSign, apiSecret)

    // Preparar FormData para enviar a Cloudinary
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', file)
    cloudinaryFormData.append('api_key', apiKey)
    cloudinaryFormData.append('timestamp', timestamp.toString())
    cloudinaryFormData.append('signature', signature)
    cloudinaryFormData.append('folder', folder)

    // Subir a Cloudinary con firma (upload firmado)
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    )

    const result = await cloudinaryResponse.json()

    if (!cloudinaryResponse.ok) {
      console.error('Cloudinary error:', result)
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error?.message || 'Error subiendo imagen a Cloudinary'
        }),
        { status: cloudinaryResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Devolver solo la URL segura (no exponer metadata interna)
    return new Response(
      JSON.stringify({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error en upload-image:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Función para generar signature SHA1
async function generateSignature(stringToSign, apiSecret) {
  const msgBuffer = new TextEncoder().encode(stringToSign)
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
