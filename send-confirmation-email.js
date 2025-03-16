// supabase/functions/send-confirmation-email/index.js
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, name, preferredDate, carModel } = await req.json()
    
    if (!to || !name || !preferredDate || !carModel) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Get your SendGrid API key from environment variables
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
    
    // If you're using a different email service, replace this section with your provider's API
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject: 'Your CarMaster Appointment is Confirmed!',
            dynamic_template_data: {
              name: name,
              date: preferredDate,
              carModel: carModel
            }
          }
        ],
        from: { email: 'appointments@carmaster.com', name: 'CarMaster Auto Services' },
        template_id: 'd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your SendGrid template ID
      }),
    })

    if (response.status >= 400) {
      const errorText = await response.text()
      console.error('SendGrid API error:', errorText)
      throw new Error(`Failed to send email: ${response.status}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})