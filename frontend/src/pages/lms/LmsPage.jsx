import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../../api/client';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const STATUSES = ['All', 'Active', 'Draft', 'Archived'];
const STATUS_BADGES = {
  Active: 'bg-green-100 text-green-700',
  Draft: 'bg-amber-100 text-amber-700',
  Archived: 'bg-slate-200 text-slate-700'
};

export default function LmsPage() {
  const [courses, setCourses] = useState([]);
  const [lessonsByCourse, setLessonsByCourse] = useState({});
  const [detailsByCourse, setDetailsByCourse] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', level: 'Beginner', status: 'Draft', instructorName: '' });
  const [queryText, setQueryText] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [instructorFilter, setInstructorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [lessonForm, setLessonForm] = useState({ chapterTitle: 'General', chapterId: '', title: '', videoUrl: '' });
  const [chapterForm, setChapterForm] = useState({ title: '', description: '' });
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const activeRole = useSelector((s) => s.auth.activeRole);
  const canManageLessons = ['Teacher', 'Admin', 'SuperAdmin', 'teacher', 'admin', 'super_admin'].includes(activeRole);

  const loadCourses = async () => {
    const { data } = await api.get('/lms/courses', { params: { status: statusFilter } });
    setCourses(data.items);
  };

  useEffect(() => {
    loadCourses();
    const interval = setInterval(loadCourses, 10000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  useEffect(() => {
    if (!expanded) return;
    const interval = setInterval(() => loadCourseDetails(expanded), 10000);
    return () => clearInterval(interval);
  }, [expanded]);

  const instructorOptions = useMemo(() => {
    const names = Array.from(new Set(courses.map((c) => c.instructor_name).filter(Boolean)));
    return ['All', ...names];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesLevel = levelFilter === 'All' || course.level === levelFilter;
      const matchesInstructor = instructorFilter === 'All' || course.instructor_name === instructorFilter;
      const matchesStatus = statusFilter === 'All' || course.status === statusFilter;
      const matchesSearch = !q || course.title?.toLowerCase().includes(q) || course.instructor_name?.toLowerCase().includes(q);
      return matchesLevel && matchesInstructor && matchesStatus && matchesSearch;
    });
  }, [courses, queryText, levelFilter, instructorFilter, statusFilter]);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/lms/courses', form);
    setForm({ title: '', description: '', level: 'Beginner', status: 'Draft', instructorName: '' });
    loadCourses();
  };

  const loadCourseDetails = async (courseId) => {
    const [{ data: lessonsData }, { data: detailsData }] = await Promise.all([
      api.get(`/lms/courses/${courseId}/lessons`),
      api.get(`/lms/courses/${courseId}/detail`)
    ]);
    setLessonsByCourse((prev) => ({ ...prev, [courseId]: lessonsData.items }));
    setDetailsByCourse((prev) => ({ ...prev, [courseId]: detailsData }));
  };

  const toggleExpand = async (courseId) => {
    if (expanded === courseId) {
      setExpanded(null);
      return;
    }
    setExpanded(courseId);
    await loadCourseDetails(courseId);
  };

  const openPreview = async (courseId) => {
    const { data } = await api.get(`/lms/courses/${courseId}/detail`);
    setPreviewData(data.preview);
    setPreviewModalOpen(true);
  };

  const openAddLesson = (courseId) => {
    setSelectedCourseId(courseId);
    setLessonForm({ chapterTitle: 'General', chapterId: '', title: '', videoUrl: '' });
    setLessonModalOpen(true);
  };

  const openAddChapter = (courseId) => {
    setSelectedCourseId(courseId);
    setChapterForm({ title: '', description: '' });
    setChapterModalOpen(true);
  };

  const saveLesson = async (e) => {
    e.preventDefault();
    await api.post(`/lms/courses/${selectedCourseId}/lessons`, lessonForm);
    await loadCourseDetails(selectedCourseId);
    loadCourses();
    setLessonModalOpen(false);
  };

  const saveChapter = async (e) => {
    e.preventDefault();
    await api.post(`/lms/courses/${selectedCourseId}/chapters`, chapterForm);
    await loadCourseDetails(selectedCourseId);
    setChapterModalOpen(false);
  };

  const toggleCompleted = async (courseId, lessonId, completed) => {
    await api.post(`/lms/lessons/${lessonId}/progress`, { completed });
    await loadCourseDetails(courseId);
    loadCourses();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">LMS Courses</h2>

      <form className="bg-white p-4 rounded shadow grid gap-2 md:grid-cols-2" onSubmit={submit}>
        <input className="input" placeholder="Course title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="input" placeholder="Instructor name" value={form.instructorName} onChange={(e) => setForm({ ...form, instructorName: e.target.value })} />
        <select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>{LEVELS.slice(1).map((l) => <option key={l}>{l}</option>)}</select>
        <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{STATUSES.slice(1).map((s) => <option key={s}>{s}</option>)}</select>
        <textarea className="input md:col-span-2" placeholder="Description / Introduction" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn md:col-span-2">Create Course</button>
      </form>

      <div className="bg-white rounded shadow p-3 grid md:grid-cols-4 gap-2">
        <input className="input" placeholder="Search by title or instructor" value={queryText} onChange={(e) => setQueryText(e.target.value)} />
        <select className="input" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select>
        <select className="input" value={instructorFilter} onChange={(e) => setInstructorFilter(e.target.value)}>{instructorOptions.map((i) => <option key={i}>{i}</option>)}</select>
        <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>

      <div className="grid gap-3">
        {filteredCourses.map((course) => {
          const progress = Number(course.completionpercent ?? course.completionPercent ?? 0);
          const isExpanded = expanded === course.id;
          const lessons = lessonsByCourse[course.id] || [];
          const details = detailsByCourse[course.id];

          return (
            <div key={course.id} className="bg-white p-4 rounded shadow">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="text-sm text-slate-600">{course.instructor_name || 'Unknown instructor'} • {course.level}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`text-xs px-2 py-1 rounded ${STATUS_BADGES[course.status] || STATUS_BADGES.Draft}`}>{course.status || 'Draft'}</span>
                  <button className="btn" onClick={() => openPreview(course.id)}>Preview</button>
                  <button className="btn" onClick={() => toggleExpand(course.id)}>{isExpanded ? 'Hide Details' : 'View Details'}</button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 border-t pt-4 space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>Student Completion</span><span>{progress}%</span></div>
                    <div className="h-2 bg-slate-200 rounded"><div className="h-2 bg-blue-600 rounded" style={{ width: `${progress}%` }} /></div>
                    <p className="text-xs text-slate-500 mt-1">Completed lessons/quizzes: {(course.completed_lessons || 0) + (course.completed_quizzes || 0)} / {(course.total_lessons || 0) + (course.total_quizzes || 0)}</p>
                  </div>

                  {canManageLessons && (
                    <div className="flex gap-2">
                      <button className="btn" onClick={() => openAddChapter(course.id)}>Add Chapter</button>
                      <button className="btn" onClick={() => openAddLesson(course.id)}>Add Lesson</button>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Lessons</h4>
                    <div className="space-y-2">
                      {lessons.map((lesson) => (
                        <label key={lesson.id} className="p-2 border rounded text-sm flex items-center justify-between gap-3">
                          <span><span className="font-medium">{lesson.chapter_name || lesson.chapter_title}</span> — {lesson.title}</span>
                          <input type="checkbox" checked={Boolean(lesson.is_completed)} onChange={(e) => toggleCompleted(course.id, lesson.id, e.target.checked)} />
                        </label>
                      ))}
                      {!lessons.length && <p className="text-sm text-slate-500">No lessons yet.</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Enrolled Students & Progress</h4>
                    <div className="space-y-2">
                      {(details?.students || []).map((student) => (
                        <div key={student.student_profile_id} className="border rounded p-2">
                          <div className="flex justify-between text-sm"><span>{student.full_name}</span><span>{student.progress}%</span></div>
                          <div className="h-2 bg-slate-200 rounded mt-1"><div className="h-2 bg-emerald-600 rounded" style={{ width: `${student.progress}%` }} /></div>
                        </div>
                      ))}
                      {details && !details.students?.length && <p className="text-sm text-slate-500">No enrolled students.</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {previewModalOpen && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
          <div className="bg-white rounded-lg shadow p-4 w-full max-w-xl space-y-3">
            <h3 className="text-xl font-semibold">Course Preview</h3>
            <p className="text-slate-700">{previewData?.introduction || 'No introduction provided.'}</p>
            <div className="border rounded p-3">
              <p className="text-sm text-slate-500">First Lesson</p>
              <p className="font-medium">{previewData?.firstLesson?.title || 'No lessons yet.'}</p>
              {previewData?.firstLesson?.video_url && <a className="text-blue-600 text-sm" href={previewData.firstLesson.video_url} target="_blank">Open lesson video</a>}
            </div>
            <div className="flex justify-end"><button className="btn" onClick={() => setPreviewModalOpen(false)}>Close</button></div>
          </div>
        </div>
      )}

      {lessonModalOpen && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
          <form className="bg-white rounded-lg shadow p-4 w-full max-w-lg space-y-2" onSubmit={saveLesson}>
            <h3 className="text-xl font-semibold">Add Lesson</h3>
            <select className="input" value={lessonForm.chapterId} onChange={(e) => {
              const selected = (detailsByCourse[selectedCourseId]?.chapters || []).find((c) => c.id === e.target.value);
              setLessonForm({ ...lessonForm, chapterId: e.target.value, chapterTitle: selected?.title || 'General' });
            }}>
              <option value="">General</option>
              {(detailsByCourse[selectedCourseId]?.chapters || []).map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}
            </select>
            <input className="input" placeholder="Lesson title" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required />
            <input className="input" placeholder="Video URL (optional)" value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} />
            <div className="flex justify-end gap-2"><button type="button" className="px-3 py-2 border rounded" onClick={() => setLessonModalOpen(false)}>Cancel</button><button className="btn">Save</button></div>
          </form>
        </div>
      )}

      {chapterModalOpen && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
          <form className="bg-white rounded-lg shadow p-4 w-full max-w-lg space-y-2" onSubmit={saveChapter}>
            <h3 className="text-xl font-semibold">Add Chapter</h3>
            <input className="input" placeholder="Chapter title" value={chapterForm.title} onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })} required />
            <textarea className="input" placeholder="Chapter description" value={chapterForm.description} onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })} />
            <div className="flex justify-end gap-2"><button type="button" className="px-3 py-2 border rounded" onClick={() => setChapterModalOpen(false)}>Cancel</button><button className="btn">Save</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
