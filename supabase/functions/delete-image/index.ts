import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
    const { imageUrl } = await req.json()
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'Image URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Función para extraer public_id de URL de Cloudinary
    const getPublicIdFromUrl = (url) => {
      try {
        const regex = /\/upload\/(?:v\d+\/)?([^\/\.]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
      } catch (error) {
        console.error('Error extracting public_id from URL:', error);
        return null;
      }
    };

    const publicId = getPublicIdFromUrl(imageUrl);
    
    if (!publicId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid Cloudinary URL or public_id not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Configuración de Cloudinary desde variables de entorno
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY')
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')

    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({ success: false, error: 'Cloudinary credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generar signature para autenticación
    const timestamp = Math.round(Date.now() / 1000)
    const signature = await generateSignature(publicId, timestamp, apiSecret)

    // Preparar FormData para la petición a Cloudinary
    const formData = new FormData()
    formData.append('public_id', publicId)
    formData.append('timestamp', timestamp.toString())
    formData.append('api_key', apiKey)
    formData.append('signature', signature)

    // Llamar a la API de Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const result = await cloudinaryResponse.json()

    if (result.result === 'ok') {
      return new Response(
        JSON.stringify({ success: true, message: 'Image deleted successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else if (result.result === 'not found') {
      return new Response(
        JSON.stringify({ success: true, message: 'Image was already deleted or not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to delete image from Cloudinary' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Función para generar signature SHA1
async function generateSignature(publicId, timestamp, apiSecret) {
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
  const msgBuffer = new TextEncoder().encode(stringToSign)
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}