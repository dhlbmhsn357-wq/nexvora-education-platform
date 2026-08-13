# NEXVORA Component Reference

## Layout

- `AppShell`: منسق الهيكل العام وحالة الـSidebar والـDrawer فقط.
- `Sidebar`: تنقل مبني على الصلاحيات، حساب المستخدم، ووضع مصغر لسطح المكتب.
- `Topbar`: هوية الحساب، الدور، التاريخ، والتنبيهات.
- `MobileDrawer`: فتح وإغلاق التنقل على الموبايل مع Escape وخلفية مستقلة.
- `Breadcrumbs`: مسار عربي تلقائي للمسارات العميقة.
- `PageHeader`: eyebrow، عنوان، وصف، وإجراءات الصفحة.
- `Panel`: سطح محتوى اختياري العنوان والوصف والإجراء.

## Actions & Forms

- `Button`: `primary | secondary | ghost | danger`، حالتا `small | medium`، ودعم loading/disabled.
- `ProtectedButton`: يربط الظهور والتعطيل بالصلاحية والدور وحساب المحاسب.
- `Field`: Label وHint وError وRequired.
- `Input`, `Select`, `Textarea`: أغلفة Typed لعناصر HTML الأصلية.
- `ConfirmDialog`: Alert Dialog مع Escape وFocus trap وإعادة التركيز.

## Data & Feedback

- `MetricCard`: مؤشر تشغيلي مختصر.
- `ExecutiveKpi`: مؤشر تنفيذي قابل للربط بالمصدر.
- `DataTable`: جدول Typed بأعمدة وقيم دلالية.
- `MobileCard`: تمثيل السجل في الشاشات الضيقة.
- `Timeline`: سجل أحداث وتسلسل زمني موحد.
- `FilterBar`: منطقة بحث وتصفية قابلة للوصول.
- `Toast`: رسالة نجاح غير معطلة للتدفق.
- `StatusBadge`: `success | warning | danger | neutral` مع نص، وليس اللون وحده.
- `EmptyState`: عنوان ووصف وإجراء استرداد.
- `Skeleton`: حالة تحميل دلالية تدعم reduced motion.
- `ErrorBoundary`: عزل أعطال العرض وإعادة المحاولة.

## عقود الاستخدام

- استخدم HTML الأصلي قبل ARIA.
- Icon-only button يحتاج اسمًا عربيًا قابلًا للقراءة.
- لا تضع منطق صلاحيات داخل CSS.
- الجداول يجب أن تحتوي `data-label` لكل خلية لتتحول إلى Mobile Cards.
- الإجراءات الحساسة تمر عبر Store حتى لو كانت محمية في الواجهة.
- لا تستخدم ألوانًا خامًا داخل المكونات؛ استخدم Semantic Tokens.
- لا تستخدم `style={{...}}` داخل React؛ نسب التقدم تستخدم عنصر `progress` الأصلي.
