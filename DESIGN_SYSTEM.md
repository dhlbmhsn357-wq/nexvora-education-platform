# NEXVORA Design System

## مبادئ التصميم

1. **القرار قبل التفاصيل:** تعرض الصفحة أهم ما يحتاجه الدور أولًا.
2. **الاستثناء قبل الروتين:** المخاطر والتعارضات والمتأخرات أعلى من السجلات الطبيعية.
3. **إجراء بأثر واضح:** كل زر حساس يوضح النتيجة ويُسجل في التدقيق.
4. **فصل الأدوار:** CEO للرقابة، التشغيل للتنفيذ، المحاسب للدقة، المتابعة للتواصل، والمدرس لنطاقه التعليمي.
5. **لغة مؤسسية عربية:** نصوص مباشرة، RTL أصلي، ومصطلحات ثابتة.
6. **لون وظيفي محدود:** Navy للهيكل، Teal للإجراء، والألوان الدلالية للحالات فقط.
7. **وصول دون تنازلات:** لوحة مفاتيح، Focus واضح، 44px للمس، وتباين AA.
8. **كثافة قابلة للإدارة:** لا بطاقات زخرفية ولا فراغات استعراضية.

## Tokens

- Primary Navy: `#0F172A`
- Primary Teal: `#0D9488`
- Background: `#F8FAFC`
- Surface: `#FFFFFF`
- Border: `#E2E8F0`
- Primary Text: `#0F172A`
- Secondary Text: `#475569`
- Muted Text: `#64748B`
- Success: `#059669`
- Warning: `#B45309`
- Danger: `#DC2626`
- Info: `#2563EB`
- Focus: `#14B8A6`

المصدر البرمجي: `src/styles/tokens.ts`. الربط الفعلي عبر `src/styles/design-system.css`.

## Typography

الخط الوحيد: **IBM Plex Sans Arabic** مع Tahoma وArial كـfallback.

- Display: 32px
- Page title: 24px
- Section title: 18px
- Card title: 16px
- Body: 14–16px حسب السياق
- Small: 12px
- Label: 11–12px
- القيم الرقمية: `tabular-nums`

## Spacing

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.

مسافة الصفحة تتكيف باستخدام `clamp`. الأقسام الرئيسية 20–24px، داخل المكوّن 12–20px.

## Radius & Elevation

- Small: 4px
- Medium: 8px
- Large: 12px
- Shadow الوحيد: `0 1px 3px rgba(15,23,42,.1)`

الحدود هي وسيلة الفصل الأساسية. لا Glassmorphism ولا ظلال ثقيلة ولا Gradients زخرفية.

## Motion

150–200ms ease-out. لا حركة تغيّر أبعاد التخطيط. `prefers-reduced-motion` يلغي الحركة غير الضرورية.

## Responsive

- Mobile: 375–430px
- Tablet: 768px
- Compact desktop: 1024px
- Desktop: 1280–1440px

تتحول Sidebar إلى Drawer تحت 1024px. الجداول إلى بطاقات تحت 650px. Touch targets لا تقل عن 44px.

## Dark Mode

Semantic Tokens منفصلة للخلفية والأسطح والنص والحدود. لا يُفترض أن لون Light Mode صالح تلقائيًا للداكن.

## اتجاه المحتوى

الواجهة `dir=rtl`. المسافات والمحاذاة تستخدم الخصائص المنطقية. معرفات الأكواد والمراجع المالية يمكن أن تستخدم `dir=ltr` محليًا عند الحاجة.
