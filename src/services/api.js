export const API_URL = 'https://api.sory.ifran-b3dev.com'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
})

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
};



const publicHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
})

export const apiRegister = async (data) => {
  const res = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: publicHeaders(),
    body: JSON.stringify(data),
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export const apiLogin = async (data) => {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: publicHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  console.log("LOGIN RESULT:", result);

  const token = result.access_token;

  if (token) {
    localStorage.setItem('token', token);
    console.log("TOKEN SAVED:", token);
  } else {
    console.error("TOKEN NOT FOUND");
  }

  return { ok: res.ok, status: res.status, data: result };
};

export const apiLogout = async () => {
  const res = await fetch(`${API_URL}/api/logout`, {
    method: 'POST',
    headers: getHeaders(),
  })
  return { ok: res.ok }
}

export const apiGetEspaces = async (page = 1, params = {}) => {
  const query = new URLSearchParams({ page, ...params }).toString()
  const res = await fetch(`${API_URL}/api/espaces?${query}`, {
    headers: { 'Accept': 'application/json' },
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiGetEspace = async (id) => {
  const res = await fetch(`${API_URL}/api/espaces/${id}`, {
    headers: { 'Accept': 'application/json' },
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiAdminGetEspaces = async (page = 1) => {
  const res = await fetch(`${API_URL}/api/admin/espaces?page=${page}`, {
    headers: getHeaders(),
  });
  return { ok: res.ok, data: await res.json() };
};

export const apiCreateEspace = async (formData) => {
  const res = await fetch(`${API_URL}/api/espaces`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiUpdateEspace = async (id, formData) => {
  formData.append('_method', 'PUT');
  const res = await fetch(`${API_URL}/api/espaces/${id}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiDeleteEspace = async (id) => {
  const res = await fetch(`${API_URL}/api/espaces/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  return { ok: res.ok }
}

export const apiGetMyReservations = async (page = 1, params = {}) => {
  const query = new URLSearchParams({ page, ...params }).toString()
  const res = await fetch(`${API_URL}/api/Mes-reservations?${query}`, {
    headers: getHeaders(),
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiGetReservations = async (page = 1, params = {}) => {
  const query = new URLSearchParams({ page, ...params }).toString()
  const res = await fetch(`${API_URL}/api/reservations?${query}`, {
    headers: getHeaders(),
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiCreateReservation = async (data) => {
  const res = await fetch(`${API_URL}/api/reservations`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export const apiDeleteReservation = async (id) => {
  const res = await fetch(`${API_URL}/api/reservations/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  return { ok: res.ok }
}

export const apiGetUsers = async (page = 1, params = {}) => {
  const query = new URLSearchParams({ page, ...params }).toString()
  const res = await fetch(`${API_URL}/api/users?${query}`, {
    headers: getHeaders(),
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiGetUser = async (id) => {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    headers: getHeaders(),
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiUpdateUser = async (id, data) => {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiDeleteUser = async (id) => {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  return { ok: res.ok }
}

export const apiCreateAdmin = async (data) => {
  const res = await fetch(`${API_URL}/api/admin/create`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export const apiGetEquipements = async () => {
  const res = await fetch(`${API_URL}/api/equipements`, {
    headers: getHeaders(),
  });

  return { ok: res.ok, data: await res.json() };
};

export const apiCreateEquipement = async (data) => {
  const res = await fetch(`${API_URL}/api/equipements`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return { ok: res.ok, data: await res.json() }
}



export const apiUpdateEquipement = async (id, data) => {
  const res = await fetch(`${API_URL}/api/equipements/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiDeleteEquipement = async (id) => {
  const res = await fetch(`${API_URL}/api/equipements/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  return { ok: res.ok }
}
