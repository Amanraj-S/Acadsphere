import API from './api';

// COLLEGE SEMESTERS
export const addCollegeSemester = async (data) => {
  const res = await API.post('/college', data); // POST /college
  return res.data;
};

export const getCollegeSemesters = async () => {
  const res = await API.get('/college'); // GET /college
  return res.data;
};

// SCHOOL EXAMS
export const addSchoolExam = async (data) => {
  const res = await API.post('/school', data); // POST /school
  return res.data;
};

export const getSchoolExams = async () => {
  const res = await API.get('/school'); // GET /school
  return res.data;
};
