import { useAuth } from '../contexts/AuthContext';
import { FileText, CheckCircle, ArrowLeft as ArrowLeftIcon, FileSearch as FileSearchIcon, Sparkles as SparklesIcon, Zap as ZapIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function LandingPage() {
  const { loginWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to the dashboard if user is already logged in
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      {/* Iframe Warning for Popup Blocking */}
      {window.self !== window.top && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3" dir="rtl">
          <div className="mx-auto max-w-7xl flex items-center justify-between text-sm text-yellow-800">
            <p>
              <strong>ملاحظة:</strong> لتجنب مشاكل تسجيل الدخول، يُفضل فتح التطبيق في نافذة مستقلة.
            </p>
            <a 
              href={window.location.href} 
              target="_blank" 
              rel="noreferrer" 
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-900 px-3 py-1.5 rounded-md font-medium transition-colors border border-yellow-300"
            >
              فتح في نافذة جديدة
            </a>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pb-20 pt-24 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              اكتب سيرة ذاتية احترافية تتخطى أنظمة <span className="text-blue-600">ATS</span> بسهولة
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              منصة متكاملة مدعومة بالذكاء الاصطناعي لكتابة وتنسيق وفحص سيرتك الذاتية لضمان وصولك للمقابلة الشخصية في أفضل الشركات.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              {!user ? (
                <>
                  <button
                    onClick={loginWithGoogle}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
                  >
                    إنشاء حساب جديد
                    <ArrowLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={loginWithGoogle}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-8 py-4 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-all"
                  >
                    تسجيل الدخول
                  </button>
                </>
              ) : (
                <a
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
                >
                  الذهاب للوحة التحكم
                  <ArrowLeftIcon className="h-5 w-5" />
                </a>
              )}
            </div>
          </motion.div>
        </div>
        {/* Background decorative elements */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#90c0ff] to-[#1d4ed8] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">كل ما تحتاجه للنجاح المهني</h2>
            <p className="mt-4 text-lg text-gray-600">أدوات متطورة تساعدك على إبراز مهاراتك بالشكل الأمثل</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">كاتب ذكي للسير الذاتية</h3>
              <p className="text-gray-600 leading-relaxed">
                دع الذكاء الاصطناعي يصيغ خبراتك ومهاراتك بطريقة احترافية تجذب مسؤولي التوظيف.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <FileSearchIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">فحص أنظمة ATS</h3>
              <p className="text-gray-600 leading-relaxed">
                تحليل دقيق لسيرتك الذاتية ومطابقتها مع الوصف الوظيفي لضمان تخطي أنظمة الفرز الآلي.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <ZapIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">قوالب احترافية جاهزة</h3>
              <p className="text-gray-600 leading-relaxed">
                مجموعة متنوعة من القوالب المصممة وفقاً للمعايير العالمية، جاهزة للتحميل والتصدير بصيغة PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / CTA Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gray-900 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-multiply"></div>
            <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  استثمر في مستقبلك المهني اليوم
                </h2>
                <p className="mt-4 text-lg text-gray-300">
                  ابدأ مجاناً وقم بترقية حسابك لاحقاً للاستفادة من كافة الميزات المتقدمة مثل التحليل الشامل لأكثر من 10 وظائف وعمل نسخ متعددة للسير الذاتية.
                </p>
                <div className="mt-8 flex gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-blue-400" /> خطة مجانية مدى الحياة</div>
                  <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-blue-400" /> باقات مدفوعة قادمة قريباً</div>
                </div>
              </div>
              <div className="mt-10 lg:mt-0 lg:flex-shrink-0">
                <button
                  onClick={!user ? loginWithGoogle : undefined}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow hover:bg-gray-50 transition-colors sm:w-auto"
                >
                  {user ? 'الذهاب للوحة التحكم' : 'أنشئ حسابك مجاناً'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-6 w-6 text-gray-400" />
            <span className="text-lg font-bold text-gray-900">سيرتي</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} منصة سيرتي. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
