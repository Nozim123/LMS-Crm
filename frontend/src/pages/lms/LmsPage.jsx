import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../../api/client';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const INSTRUCTORS = ['All'];
const STATUSES = {
  Active: 'bg-green-100 text-green-700',
  Draft: 'bg-amber-100 text-amber-700',
  Archived: 'bg-slate-200 text-slate-700'
};

export default function LmsPage() {
  const [courses, setCourses] = useState([]);
  const [lessonsByCourse, setLessonsByCourse] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', level: 'Beginner', status: 'Draft', instructorName: '' });
  const [queryText, setQueryText] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [instructorFilter, setInstructorFilter] = useState('All');
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [lessonForm, setLessonForm] = useState({ chapterTitle: 'General', title: '', videoUrl: '' });
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const activeRole = useSelector((s) => s.auth.activeRole);
  const canManageLessons = ['Teacher', 'Admin', 'SuperAdmin', 'teacher', 'admin', 'super_admin'].includes(activeRole);

  const load = () => api.get('/lms/courses').then((r) => setCourses(r.data.items));

  useEffect(() => {
    load();
  }, []);

  const instructorOptions = useMemo(() => {
    const names = Array.from(new Set(courses.map((c) => c.instructor_name).filter(Boolean)));
    return [...INSTRUCTORS, ...names];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesLevel = levelFilter === 'All' || course.level === levelFilter;
      const matchesInstructor = instructorFilter === 'All' || course.instructor_name === instructorFilter;
      const matchesSearch =
        !q ||
        course.title?.toLowerCase().includes(q) ||
        course.instructor_name?.toLowerCase().includes(q);

      return matchesLevel && matchesInstructor && matchesSearch;
    });
  }, [courses, queryText, levelFilter, instructorFilter]);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/lms/courses', form);
    setForm({ title: '', description: '', level: 'Beginner', status: 'Draft', instructorName: '' });
    load();
  };

  const toggleExpand = async (courseId) => {
    if (expanded === courseId) {
      setExpanded(null);
      return;
    }

    setExpanded(courseId);
    if (!lessonsByCourse[courseId]) {
      const { data } = await api.get(`/lms/courses/${courseId}/lessons`);
      setLessonsByCourse((prev) => ({ ...prev, [courseId]: data.items }));
    }
  };

  const openAddLesson = (courseId) => {
    setSelectedCourseId(courseId);
    setLessonForm({ chapterTitle: 'General', title: '', videoUrl: '' });
    setLessonModalOpen(true);
  };

  const saveLesson = async (e) => {
    e.preventDefault();
    await api.post(`/lms/courses/${selectedCourseId}/lessons`, lessonForm);
    const { data } = await api.get(`/lms/courses/${selectedCourseId}/lessons`);
    setLessonsByCourse((prev) => ({ ...prev, [selectedCourseId]: data.items }));
    setLessonModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">LMS Courses</h2>

      <form className="bg-white p-4 rounded shadow grid gap-2 md:grid-cols-2" onSubmit={submit}>
        <input className="input" placeholder="Course title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="input" placeholder="Instructor name" value={form.instructorName} onChange={(e) => setForm({ ...form, instructorName: e.target.value })} />
        <select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
          {LEVELS.slice(1).map((l) => <option key={l}>{l}</option>)}
        </select>
        <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          {Object.keys(STATUSES).map((s) => <option key={s}>{s}</option>)}
        </select>
        <textarea className="input md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn md:col-span-2">Create Course</button>
      </form>

      <div className="bg-white rounded shadow p-3 grid md:grid-cols-3 gap-2">
        <input
          className="input"
          placeholder="Search by title or instructor"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
        />
        <select className="input" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
          {LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <select className="input" value={instructorFilter} onChange={(e) => setInstructorFilter(e.target.value)}>
          {instructorOptions.map((i) => <option key={i}>{i}</option>)}
        </select>
      </div>

      <div className="grid gap-3">
        {filteredCourses.map((course) => {
          const progress = Number(course.completionpercent ?? course.completionPercent ?? 0);
          const isExpanded = expanded === course.id;
          const lessons = lessonsByCourse[course.id] || [];

          return (
            <div key={course.id} className="bg-white p-4 rounded shadow">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="text-sm text-slate-600">{course.instructor_name || 'Unknown instructor'} • {course.level}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`text-xs px-2 py-1 rounded ${STATUSES[course.status] || STATUSES.Draft}`}>{course.status || 'Draft'}</span>
                  <button className="btn" onClick={() => toggleExpand(course.id)}>{isExpanded ? 'Hide Details' : 'View Details'}</button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 border-t pt-4 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Student Completion</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded">
                      <div className="h-2 bg-blue-600 rounded" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Completed lessons/quizzes: {(course.completed_lessons || 0) + (course.completed_quizzes || 0)} / {(course.total_lessons || 0) + (course.total_quizzes || 0)}
                    </p>
                  </div>

                  {canManageLessons && (
                    <button className="btn" onClick={() => openAddLesson(course.id)}>Add Lesson</button>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Lessons</h4>
                    <div className="space-y-2">
                      {lessons.map((lesson) => (
                        <div key={lesson.id} className="p-2 border rounded text-sm">
                          <span className="font-medium">{lesson.chapter_title}</span> — {lesson.title}
                        </div>
                      ))}
                      {!lessons.length && <p className="text-sm text-slate-500">No lessons yet.</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {lessonModalOpen && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
          <form className="bg-white rounded-lg shadow p-4 w-full max-w-lg space-y-2" onSubmit={saveLesson}>
            <h3 className="text-xl font-semibold">Add Lesson</h3>
            <input className="input" placeholder="Chapter" value={lessonForm.chapterTitle} onChange={(e) => setLessonForm({ ...lessonForm, chapterTitle: e.target.value })} required />
            <input className="input" placeholder="Lesson title" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required />
            <input className="input" placeholder="Video URL (optional)" value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} />
            <div className="flex justify-end gap-2">
              <button type="button" className="px-3 py-2 border rounded" onClick={() => setLessonModalOpen(false)}>Cancel</button>
              <button className="btn">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
