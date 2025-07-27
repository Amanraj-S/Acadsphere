import API from './api';

// ===== COLLEGE SEMESTERS =====

export const addCollegeSemester = async (data) => {
  const res = await API.post('/college', data); // POST /college
  return res.data;
};

export const getCollegeSemesters = async () => {
  const res = await API.get('/college'); // GET /college
  return res.data;
};

export const updateCollegeSemester = async (id, data) => {
  const res = await API.put(`/college/${id}`, data); // PUT /college/:id
  return res.data;
};

export const deleteCollegeSemester = async (id) => {
  const res = await API.delete(`/college/${id}`); // DELETE /college/:id
  return res.data;
};

export const deleteCollegeSemesterByLabel = async (label) => {
  const res = await API.delete(`/college/label/${label}`); // DELETE /college/label/:semester
  return res.data;
};

// ===== SCHOOL EXAMS =====

export const addSchoolExam = async (data) => {
  const res = await API.post('/school', data); // POST /school
  return res.data;
};

export const getSchoolExams = async () => {
  const res = await API.get('/school'); // GET /school
  return res.data;
};

export const updateSchoolExam = async (id, data) => {
  const res = await API.put(`/school/${id}`, data); // PUT /school/:id
  return res.data;
};

export const deleteSchoolExam = async (id) => {
  const res = await API.delete(`/school/${id}`); // DELETE /school/:id
  return res.data;
};
