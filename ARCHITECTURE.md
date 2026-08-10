# NEXVORA React Architecture

المدخل الرسمي للمشروع هو `index.html` أثناء التطوير، و`dist/index.html` للنسخة الإنتاجية التي تعمل مباشرة.

## Structure

- `src/domain`: أنواع المجال ومصفوفة الصلاحيات.
- `src/data`: بيانات النموذج الأولية فقط.
- `src/store`: حالة Zustand المحلية وعمليات المجال المحمية بالصلاحيات.
- `src/components`: هيكل التطبيق ومكونات الواجهة المشتركة.
- `src/pages`: شاشات مستقلة مربوطة بمسارات React Router.
- `TEST-COVERAGE.md`: مصفوفة التدفقات والحالات التي تم التحقق منها فعليًا.

## Runtime

- React + TypeScript + Vite.
- `HashRouter` حتى تعمل نسخة `dist` مباشرة دون خادم خلفي.
- Zustand Persist لحفظ التغييرات وإثباتات الدفع داخل `localStorage`.
- كل عملية حساسة تتحقق من الصلاحية داخل الـstore، وليس داخل الزر فقط.

## Commands

- `pnpm dev`: تشغيل بيئة التطوير.
- `pnpm build`: فحص TypeScript وإنشاء نسخة الإنتاج.
- افتح `NEXVORA-FINAL.html` لتشغيل آخر نسخة إنتاجية مباشرة.
