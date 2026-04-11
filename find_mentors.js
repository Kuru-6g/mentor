
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://lvvqscckpqdpyndtwkmo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2dnFzY2NrcHFkcHluZHR3a21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTc1MzQsImV4cCI6MjA3ODM3MzUzNH0.d8I5bK_6YL49wqoid_geGcSAOsGIVdYX8tdmQ5gGcWo'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function listMentors() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'mentor')
        .limit(5)

    if (error) {
        console.error('Error fetching mentors:', error)
        return
    }

    console.log('Mentors found:', JSON.stringify(data, null, 2))
}

listMentors()
