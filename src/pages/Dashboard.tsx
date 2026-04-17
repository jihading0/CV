import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Printer, Plus, Trash2, LogOut } from 'lucide-react';

type PersonalInfo = { fullName: string; jobTitle: string; email: string; phone: string; address: string; summary: string; };
type Experience = { id: string; title: string; company: string; startDate: string; endDate: string; description: string; };
type Education = { id: string; degree: string; school: string; year: string; };
type Skill = { id: string; name: string; };

export default function Dashboard() {
  const { user, logout } = useAuth();
  
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'preview'>('personal');

  // CV State
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({ fullName: '', jobTitle: '', email: '', phone: '', address: '', summary: '' });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  // Load draft on mount
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      const docRef = doc(db, 'users', user.uid, 'cvs', 'draft');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.personalInfo) setPersonalInfo(data.personalInfo);
        if (data.experiences) setExperiences(data.experiences);
        if (data.educations) setEducations(data.educations);
        if (data.skills) setSkills(data.skills);
        if (data.updatedAt) setLastSaved(new Date(data.updatedAt));
      } else {
        // Pre-fill email/name if brand new
        setPersonalInfo(prev => ({ ...prev, fullName: user.displayName || '', email: user.email || '' }));
      }
    };
    loadData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid, 'cvs', 'draft');
      await setDoc(docRef, {
        personalInfo,
        experiences,
        educations,
        skills,
        updatedAt: Date.now()
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving CV:', error);
      alert('حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Add Item Helpers
  const addExperience = () => {
    setExperiences([...experiences, { id: crypto.randomUUID(), title: '', company: '', startDate: '', endDate: '', description: '' }]);
  };
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  const removeExperience = (id: string) => setExperiences(experiences.filter(e => e.id !== id));

  const addEducation = () => {
    setEducations([...educations, { id: crypto.randomUUID(), degree: '', school: '', year: '' }]);
  };
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducations(educations.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  const removeEducation = (id: string) => setEducations(educations.filter(e => e.id !== id));

  const addSkill = () => {
    setSkills([...skills, { id: crypto.randomUUID(), name: '' }]);
  };
  const updateSkill = (id: string, value: string) => {
    setSkills(skills.map(s => s.id === id ? { ...s, name: value } : s));
  };
  const removeSkill = (id: string) => setSkills(skills.filter(s => s.id !== id));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar - Hidden when printing */}
      <aside className="w-full md:w-64 bg-white border-l border-gray-200 p-6 no-print flex flex-col">
        <h2 className="text-xl font-bold mb-8 text-blue-600">لوحة التحكم</h2>
        
        <nav className="flex flex-col gap-2 flex-grow">
          {[{ id: 'personal', label: 'المعلومات الشخصية' },
            { id: 'experience', label: 'الخبرات المهنية' },
            { id: 'education', label: 'التعليم' },
            { id: 'skills', label: 'المهارات' },
            { id: 'preview', label: 'معاينة للطباعة (PDF)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-right px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors w-full px-4 py-2">
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 no-print overflow-y-auto h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-white p-4 rounded-xl border border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">مُنشئ السيرة الذاتية</h1>
              {lastSaved && <p className="text-sm text-gray-500 mt-1">آخر حفظ: {lastSaved.toLocaleTimeString('ar-EG')}</p>}
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Save className="h-4 w-4" />
                {saving ? 'جاري الحفظ...' : 'حفظ كمسودة'}
              </button>
              {activeTab === 'preview' && (
                <button 
                  onClick={handlePrint} 
                  className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <Printer className="h-4 w-4" />
                  طباعة كـ PDF
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-4">المعلومات الشخصية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label><input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={personalInfo.fullName} onChange={e => setPersonalInfo({...personalInfo, fullName: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">المسمى الوظيفي</label><input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={personalInfo.jobTitle} onChange={e => setPersonalInfo({...personalInfo, jobTitle: e.target.value})} placeholder="مثال: مهندس برمجيات" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label><input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label><input type="tel" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">العنوان / الموقع</label><input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={personalInfo.address} onChange={e => setPersonalInfo({...personalInfo, address: e.target.value})} /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">نبذة عنك</label><textarea rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={personalInfo.summary} onChange={e => setPersonalInfo({...personalInfo, summary: e.target.value})} placeholder="اكتب ملخصاً يعبر عن شغفك المهني وخبراتك..."></textarea></div>
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-bold text-gray-900">الخبرات المهنية</h3>
                  <button onClick={addExperience} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"><Plus className="h-4 w-4" /> إضافة خبرة</button>
                </div>
                {experiences.length === 0 && <p className="text-gray-500 text-center py-8">لم يتم إضافة خبرات مهنية بعد.</p>}
                <div className="space-y-8">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="relative bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <button onClick={() => removeExperience(exp.id)} className="absolute left-4 top-4 border p-2 rounded-lg bg-white text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      <h4 className="font-semibold text-gray-700 mb-4">خبرة #{index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">المسمى الوظيفي</label><input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg" value={exp.title} onChange={e => updateExperience(exp.id, 'title', e.target.value)} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">جهة العمل</label><input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البدء</label><input type="text" placeholder="مثال: أكتوبر 2020" className="w-full p-2.5 border border-gray-300 rounded-lg" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label><input type="text" placeholder="مثال: الحاضر" className="w-full p-2.5 border border-gray-300 rounded-lg" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">الوصف والإنجازات</label><textarea rows={3} className="w-full p-2.5 border border-gray-300 rounded-lg" value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} placeholder="- قمت بتطوير كذا..."></textarea></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-bold text-gray-900">التعليم</h3>
                  <button onClick={addEducation} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"><Plus className="h-4 w-4" /> إضافة مؤهل</button>
                </div>
                {educations.length === 0 && <p className="text-gray-500 text-center py-8">لم يتم إضافة مؤهلات تعليمية بعد.</p>}
                <div className="space-y-4">
                  {educations.map((edu) => (
                    <div key={edu.id} className="relative bg-gray-50 p-6 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button onClick={() => removeEducation(edu.id)} className="absolute left-4 top-4 border p-2 rounded-lg bg-white text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      <div className="md:col-span-2 pr-12"><label className="block text-sm font-medium text-gray-700 mb-1">الشهادة / التخصص</label><input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="بكالوريوس علوم الحاسب" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">الجامعة / المؤسسة</label><input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">سنة التخرج</label><input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-bold text-gray-900">المهارات</h3>
                  <button onClick={addSkill} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"><Plus className="h-4 w-4" /> إضافة مهارة</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                      <input type="text" className="bg-transparent border-none focus:ring-0 w-full font-medium" placeholder="اسم المهارة..." value={skill.name} onChange={e => updateSkill(skill.id, e.target.value)} />
                      <button onClick={() => removeSkill(skill.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                  {skills.length === 0 && <p className="text-gray-500 sm:col-span-2">لم يتم إضافة مهارات بعد.</p>}
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-4">معاينة السيرة الذاتية و التصدير كملف PDF</h3>
                <p className="text-gray-600">يمكنك معاينة شكل سيرتك الذاتية في الأسفل. عند الضغط على زر (طباعة كـ PDF)، اختار "حفظ بتنسيق PDF" من نافذة الطباعة.</p>
                <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-sm text-lg font-bold">
                  <Printer className="h-5 w-5" /> طباعة وتنزيل PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Printable Area - Only visibly properly when printing */}
      <div className="hidden print-only bg-white text-black p-8 max-w-4xl mx-auto rtl" dir="rtl">
        <header className="border-b-2 border-gray-800 pb-6 mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{personalInfo.fullName || 'الاسم الكامل'}</h1>
          <h2 className="text-xl text-gray-700 font-semibold mb-4">{personalInfo.jobTitle || 'المسمى الوظيفي'}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {personalInfo.email && <span className="flex items-center gap-1 text-blue-800">{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1">• {personalInfo.phone}</span>}
            {personalInfo.address && <span className="flex items-center gap-1">• {personalInfo.address}</span>}
          </div>
        </header>

        {personalInfo.summary && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1 w-max">نبذة شخصية</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{personalInfo.summary}</p>
          </section>
        )}

        {experiences.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1 w-max">الخبرات المهنية</h3>
            <div className="space-y-6">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-lg font-bold text-gray-800">{exp.title}</h4>
                    <span className="text-sm font-semibold text-gray-600">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-md font-semibold text-blue-800 mb-2">{exp.company}</div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {educations.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1 w-max">التعليم والمؤهلات</h3>
            <div className="space-y-4">
              {educations.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{edu.degree}</h4>
                    <div className="text-gray-700">{edu.school}</div>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1 w-max">المهارات</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill.id} className="bg-gray-100 border border-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm font-medium">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

    </div>
  );
}
