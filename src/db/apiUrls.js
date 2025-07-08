import supabase, { supabaseUrl } from "./supabase"

export async function getUrls(user_id) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id)

  if (error) {
    console.error(error.message)
    throw new Error("Unable to load URLs")
  }
  return data
}

export async function createUrl({title, originalUrl, customUrl, user_id}, qrCode) {
  const short_url = Math.random().toString(36).substring(2, 6)
  const fileName = `qr-${short_url}`
  const { error: storageError } = await supabase.storage
    .from("qrs")
    .upload(fileName, qrCode)

  if(storageError) throw new Error(storageError.message)

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`

  const {data, error} = await supabase
    .from("urls")
    .insert([
      {
        title,
        original_url: originalUrl, 
        custom_url: customUrl || null,
        user_id,
        short_url,
        qr,
      }
    ])
    .select()

  if (error) {
    console.error(error.message)
    throw new Error("Error creating short URL")
  }
  return data
}

export async function deleteUrl(id) {
  const { data, error } = await supabase
    .from("urls")
    .delete()
    .eq("id", id)

  if (error) {
    console.error(error.message)
    throw new Error("Unable to delete URL")
  }
  return data
}

export async function getOriginalUrl(id) {
  const { data, error } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error(error.message)
    throw new Error("Error fetching short URL")
  }
  return data
}

export async function getUrlDetails({id, user_id}) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single()

  if (error) {
    console.error(error.message)
    throw new Error("Short URL not found!")
  }
  return data
}