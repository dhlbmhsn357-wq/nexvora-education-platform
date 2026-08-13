import type { AppSettings, AttendanceRecord, AuditEvent, ExecutiveDecision, Followup, Group, LedgerEntry, MessageTemplate, Notification, PaymentSubmission, Session, Student, Teacher, UserAccount } from '../domain/types'

export const students: Student[] = [
  { id:'s1',code:'ST-1001',name:'أحمد محمد علي',phone:'01012345678',guardian:'01011112222',group:'تأسيس A',course:'اللغة العربية',packageName:'شهرية · 8 حصص',paid:700,total:1200,due:'منذ 8 أيام',status:'نشط',joinedAt:'2026-06-12' },
  { id:'s2',code:'ST-1002',name:'مريم أحمد السيد',phone:'01098765432',guardian:'01033334444',group:'المستوى الأول A',course:'اللغة العربية',packageName:'شهرية · 8 حصص',paid:1200,total:1200,due:'مستوفى',status:'نشط',joinedAt:'2026-05-03' },
  { id:'s3',code:'ST-1003',name:'يوسف محمود حسن',phone:'01122334455',guardian:'01155556666',group:'تأسيس A',course:'اللغة العربية',packageName:'شهرية · 8 حصص',paid:400,total:1200,due:'منذ 3 أيام',status:'نشط',joinedAt:'2026-07-22' },
  { id:'s4',code:'ST-1004',name:'نور محمد عبد الله',phone:'01255566778',guardian:'01288889999',group:'المستوى الأول B',course:'الرياضيات',packageName:'شهرية · 12 حصة',paid:900,total:1200,due:'منذ يومين',status:'نشط',joinedAt:'2026-08-02' },
  { id:'s5',code:'ST-1005',name:'سليم خالد محمود',phone:'01022223333',guardian:'01044445555',group:'',course:'اللغة العربية',packageName:'شهرية · 8 حصص',paid:0,total:1200,due:'موعد السداد 15 أغسطس',status:'نشط',joinedAt:'2026-08-09' },
]

export const users: UserAccount[] = [
  {id:'u-ceo',name:'د. خالد منصور',email:'ceo@nexvora.academy',role:'المدير العام',title:'المدير العام',active:true},
  {id:'u-ops',name:'محمد أشرف',email:'operations@nexvora.academy',role:'مدير التشغيل',title:'مدير التشغيل',active:true},
  {id:'u-follow',name:'سلمى حسن',email:'followup@nexvora.academy',role:'موظف المتابعة',title:'مسؤولة المتابعة',active:true},
  {id:'u-accountant-entry',name:'هبة سامي',email:'cashier@nexvora.academy',role:'المحاسب',title:'محاسب تسجيل',capabilities:['payment.create'],active:true},
  {id:'u-accountant-review',name:'كريم فؤاد',email:'reviewer@nexvora.academy',role:'المحاسب',title:'مراجع مالي',capabilities:['payment.approve'],active:true},
  {id:'u-t1',name:'أحمد مصطفى',email:'ahmed@nexvora.local',role:'المدرس',title:'مدرس اللغة العربية',teacherId:'t1',active:true},
  {id:'u-t2',name:'محمود علي',email:'mahmoud@nexvora.local',role:'المدرس',title:'مدرس اللغة العربية',teacherId:'t2',active:true},
  {id:'u-t3',name:'سارة حسن',email:'sara@nexvora.local',role:'المدرس',title:'مدرسة اللغة العربية',teacherId:'t3',active:true},
  {id:'u-t4',name:'محمد إبراهيم',email:'ibrahim@nexvora.local',role:'المدرس',title:'مدرس الرياضيات',teacherId:'t4',active:true},
  {id:'u-t5',name:'منى عادل',email:'mona@nexvora.local',role:'المدرس',title:'مدرسة الرياضيات',teacherId:'t5',active:true},
]

export const teachers: Teacher[] = [
  {id:'t1',code:'TR-1001',name:'أحمد مصطفى',phone:'01070001111',email:'ahmed@nexvora.local',specialty:'اللغة العربية',status:'نشط',startDate:'2025-09-01',notes:'مدرس مرحلة التأسيس',createdAt:'2025-09-01',updatedAt:'2026-08-01',availability:[{id:'av1',day:'الثلاثاء',start:'4:00 م',end:'8:00 م'},{id:'av2',day:'الأحد',start:'4:00 م',end:'8:00 م'}]},
  {id:'t2',code:'TR-1002',name:'محمود علي',phone:'01070002222',specialty:'اللغة العربية',status:'نشط',startDate:'2025-10-15',createdAt:'2025-10-15',updatedAt:'2026-08-02',availability:[{id:'av3',day:'الاثنين',start:'3:00 م',end:'8:00 م'},{id:'av4',day:'الأربعاء',start:'4:00 م',end:'8:00 م'}]},
  {id:'t3',code:'TR-1003',name:'سارة حسن',phone:'01070003333',specialty:'اللغة العربية',status:'نشط',startDate:'2026-01-10',createdAt:'2026-01-10',updatedAt:'2026-08-03',availability:[{id:'av5',day:'الثلاثاء',start:'5:00 م',end:'9:00 م'},{id:'av6',day:'الأربعاء',start:'5:00 م',end:'9:00 م'}]},
  {id:'t4',code:'TR-1004',name:'محمد إبراهيم',phone:'01070004444',specialty:'الرياضيات',status:'نشط',startDate:'2026-02-01',createdAt:'2026-02-01',updatedAt:'2026-08-01',availability:[{id:'av7',day:'الخميس',start:'6:00 م',end:'9:00 م'},{id:'av8',day:'الاثنين',start:'6:00 م',end:'9:00 م'}]},
  {id:'t5',code:'TR-1005',name:'منى عادل',phone:'01070005555',specialty:'الرياضيات',status:'نشط',startDate:'2026-06-01',createdAt:'2026-06-01',updatedAt:'2026-08-01',availability:[]},
]

export const groups: Group[] = [
  { id:'g1',name:'تأسيس A',course:'اللغة العربية',instructor:'أحمد مصطفى',room:'قاعة 1',enrolled:14,capacity:15,schedule:'الأحد والثلاثاء · 5:00 م',status:'نشطة' },
  { id:'g2',name:'تأسيس B',course:'اللغة العربية',instructor:'محمود علي',room:'قاعة 3',enrolled:15,capacity:15,schedule:'السبت والاثنين · 4:00 م',status:'مكتملة' },
  { id:'g3',name:'المستوى الأول A',course:'اللغة العربية',instructor:'سارة حسن',room:'قاعة 2',enrolled:10,capacity:15,schedule:'الأحد والأربعاء · 6:00 م',status:'نشطة' },
  { id:'g4',name:'المستوى الأول B',course:'الرياضيات',instructor:'محمد إبراهيم',room:'قاعة 4',enrolled:9,capacity:12,schedule:'الاثنين والخميس · 7:00 م',status:'نشطة' },
]

export const sessions: Session[] = [
  { id:'x1',group:'تأسيس A',instructor:'أحمد مصطفى',room:'قاعة 1',date:'2026-08-11',day:'الثلاثاء',start:'5:00 م',end:'6:30 م',status:'اليوم',history:[{id:'h1',action:'إنشاء الجلسة',user:'مدير التشغيل',at:'1 أغسطس، 10:00 ص'}] },
  { id:'x2',group:'المستوى الأول A',instructor:'سارة حسن',room:'قاعة 2',date:'2026-08-11',day:'الثلاثاء',start:'6:00 م',end:'7:30 م',status:'قادمة',history:[{id:'h2',action:'تغيير القاعة',before:'قاعة 1',after:'قاعة 2',user:'مدير التشغيل',at:'9 أغسطس، 2:20 م'}] },
  { id:'x3',group:'تأسيس B',instructor:'محمود علي',room:'قاعة 3',date:'2026-08-10',day:'الاثنين',start:'4:00 م',end:'5:30 م',status:'مكتملة',history:[{id:'h3',action:'تسجيل الحضور وإغلاق الجلسة',user:'المدرس',at:'10 أغسطس، 5:36 م'}] },
  { id:'x4',group:'المستوى الأول B',instructor:'محمد إبراهيم',room:'قاعة 4',date:'2026-08-13',day:'الخميس',start:'7:00 م',end:'8:30 م',status:'قادمة',history:[{id:'h4',action:'إنشاء الجلسة',user:'مدير التشغيل',at:'2 أغسطس، 11:15 ص'}] },
  { id:'x5',group:'تأسيس A',instructor:'محمود علي',room:'قاعة 5',date:'2026-08-12',day:'الأربعاء',start:'5:30 م',end:'7:00 م',status:'قادمة',history:[{id:'h5',action:'إنشاء الجلسة',user:'مدير التشغيل',at:'3 أغسطس، 9:30 ص'}] },
]

export const attendance: AttendanceRecord[] = [
  {id:'a1',studentId:'s1',sessionId:'x3',group:'تأسيس A',status:'حاضر',date:'2026-08-10',note:'',recordedBy:'المدرس'},
  {id:'a2',studentId:'s3',sessionId:'x3',group:'تأسيس A',status:'متأخر',date:'2026-08-10',note:'تأخر 10 دقائق',recordedBy:'المدرس'},
]

export const followups: Followup[] = [
  {id:'f1',studentId:'s1',method:'WhatsApp',result:'وعد بالدفع',date:'2026-08-13',note:'أكد السداد خلال يومين',escalated:false,createdBy:'موظف المتابعة'},
  {id:'f2',studentId:'s3',method:'اتصال',result:'لم يرد',date:'2026-08-12',note:'إعادة المحاولة مساءً',escalated:true,createdBy:'موظف المتابعة'},
]

export const payments: PaymentSubmission[] = [
  {id:'REV-2026-014',studentId:'s1',amount:500,method:'تحويل بنكي',reference:'TRX-260811',paymentDate:'2026-08-11',note:'دفعة أغسطس',proof:{name:'transfer-260811.jpg',type:'image/jpeg',size:184320,dataUrl:''},status:'بانتظار المراجعة',createdAt:'11 أغسطس، 9:42 ص',createdBy:'المحاسب',createdByUserId:'u-accountant-entry',createdByName:'هبة سامي',history:[{id:'r1',title:'تم تسجيل الدفعة ورفع الإثبات',user:'المحاسب',at:'11 أغسطس، 9:42 ص'}]},
  {id:'REV-2026-013',studentId:'s4',amount:300,method:'محفظة إلكترونية',reference:'WAL-88431',paymentDate:'2026-08-10',note:'إثبات محفظة',proof:{name:'wallet-proof.pdf',type:'application/pdf',size:245760,dataUrl:''},status:'بانتظار المراجعة',createdAt:'10 أغسطس، 4:18 م',createdBy:'المحاسب',createdByUserId:'u-accountant-entry',createdByName:'هبة سامي',history:[{id:'r2',title:'تم تسجيل الدفعة ورفع الإثبات',user:'المحاسب',at:'10 أغسطس، 4:18 م'}]},
  {id:'REV-2026-011',studentId:'s1',amount:300,method:'تحويل بنكي',reference:'TRX-260805',paymentDate:'2026-08-05',note:'دفعة معتمدة',proof:{name:'approved-260805.jpg',type:'image/jpeg',size:151000,dataUrl:''},status:'معتمدة',createdAt:'5 أغسطس، 10:20 ص',createdBy:'المحاسب',createdByUserId:'u-accountant-entry',createdByName:'هبة سامي',reviewedAt:'5 أغسطس، 11:05 ص',reviewedBy:'المحاسب',reviewedByUserId:'u-accountant-review',reviewedByName:'كريم فؤاد',history:[{id:'r3',title:'تم اعتماد الدفعة وتحديث الرصيد',user:'المحاسب',at:'5 أغسطس، 11:05 ص'}]},
  {id:'REV-2026-010',studentId:'s4',amount:300,method:'نقدي',reference:'CASH-260802',paymentDate:'2026-08-02',note:'دفعة معتمدة',proof:{name:'cash-receipt.jpg',type:'image/jpeg',size:128000,dataUrl:''},status:'معتمدة',createdAt:'2 أغسطس، 3:00 م',createdBy:'المحاسب',createdByUserId:'u-accountant-entry',createdByName:'هبة سامي',reviewedAt:'2 أغسطس، 3:30 م',reviewedBy:'المحاسب',reviewedByUserId:'u-accountant-review',reviewedByName:'كريم فؤاد',history:[{id:'r4',title:'تم اعتماد الدفعة وتحديث الرصيد',user:'المحاسب',at:'2 أغسطس، 3:30 م'}]},
  {id:'REV-2026-009',studentId:'s3',amount:200,method:'تحويل بنكي',reference:'TRX-REJECTED',paymentDate:'2026-08-03',note:'مرجع غير واضح',proof:{name:'rejected.jpg',type:'image/jpeg',size:88000,dataUrl:''},status:'مرفوضة',createdAt:'3 أغسطس، 1:00 م',createdBy:'المحاسب',createdByUserId:'u-accountant-entry',createdByName:'هبة سامي',reviewedAt:'3 أغسطس، 2:00 م',reviewedBy:'المحاسب',reviewedByUserId:'u-accountant-review',reviewedByName:'كريم فؤاد',reviewNote:'المرجع غير مطابق للإثبات',history:[{id:'r5',title:'تم رفض الدفعة وإعادتها للتصحيح',user:'المحاسب',at:'3 أغسطس، 2:00 م'}]},
]

export const ledger: LedgerEntry[] = [
  {id:'led-1',studentId:'s1',type:'رصيد افتتاحي',amount:400,date:'2026-07-31',status:'معتمدة',reference:'OPEN-s1',createdByUserId:'u-ops',createdByName:'محمد أشرف',reviewedByUserId:'u-ceo',reviewedByName:'د. خالد منصور',balanceBefore:0,balanceAfter:400,reason:'رصيد موثق قبل بدء فترة العرض'},
  {id:'led-2',studentId:'s1',type:'دفعة معتمدة',amount:300,date:'2026-08-05',status:'معتمدة',reference:'TRX-260805',createdByUserId:'u-accountant-entry',createdByName:'هبة سامي',reviewedByUserId:'u-accountant-review',reviewedByName:'كريم فؤاد',balanceBefore:400,balanceAfter:700,reason:'دفعة معتمدة',paymentId:'REV-2026-011'},
  {id:'led-3',studentId:'s2',type:'رصيد افتتاحي',amount:1200,date:'2026-07-31',status:'معتمدة',reference:'OPEN-s2',createdByUserId:'u-ops',createdByName:'محمد أشرف',reviewedByUserId:'u-ceo',reviewedByName:'د. خالد منصور',balanceBefore:0,balanceAfter:1200,reason:'رصيد موثق قبل بدء فترة العرض'},
  {id:'led-4',studentId:'s3',type:'رصيد افتتاحي',amount:400,date:'2026-07-31',status:'معتمدة',reference:'OPEN-s3',createdByUserId:'u-ops',createdByName:'محمد أشرف',reviewedByUserId:'u-ceo',reviewedByName:'د. خالد منصور',balanceBefore:0,balanceAfter:400,reason:'رصيد موثق قبل بدء فترة العرض'},
  {id:'led-5',studentId:'s4',type:'رصيد افتتاحي',amount:600,date:'2026-07-31',status:'معتمدة',reference:'OPEN-s4',createdByUserId:'u-ops',createdByName:'محمد أشرف',reviewedByUserId:'u-ceo',reviewedByName:'د. خالد منصور',balanceBefore:0,balanceAfter:600,reason:'رصيد موثق قبل بدء فترة العرض'},
  {id:'led-6',studentId:'s4',type:'دفعة معتمدة',amount:300,date:'2026-08-02',status:'معتمدة',reference:'CASH-260802',createdByUserId:'u-accountant-entry',createdByName:'هبة سامي',reviewedByUserId:'u-accountant-review',reviewedByName:'كريم فؤاد',balanceBefore:600,balanceAfter:900,reason:'دفعة معتمدة',paymentId:'REV-2026-010'},
]

export const executiveDecisions: ExecutiveDecision[] = [
  {id:'dec-1',type:'حوكمة',title:'اعتماد توثيق الرصيد الافتتاحي',summary:'مراجعة الرصيد الافتتاحي للطالب مريم أحمد السيد.',impact:'يثبت مصدر 1,200 ج ضمن دفتر الحركات.',requestedByUserId:'u-ops',requestedByName:'محمد أشرف',requestedAt:'11 أغسطس، 8:30 ص',evidence:'OPEN-s2 · مستند ترحيل الرصيد',route:'/ledger?student=s2',status:'بانتظار الاعتماد'},
]

export const audit: AuditEvent[] = [
  {id:'au1',type:'schedule',title:'تم تعديل قاعة جلسة',detail:'المستوى الأول A · قاعة 1 ← قاعة 2',user:'مدير التشغيل',userId:'u-ops',userName:'محمد أشرف',at:'9 أغسطس، 2:20 م',entity:'session',entityId:'x2',before:'قاعة 1',after:'قاعة 2',reason:'تحسين توزيع القاعات',sensitivity:'مهمة',route:'/sessions/x2'},
  {id:'au2',type:'followup',title:'تم تسجيل متابعة مالية',detail:'أحمد محمد علي · وعد بالدفع',user:'موظف المتابعة',userId:'u-follow',userName:'سلمى حسن',at:'10 أغسطس، 12:10 م',entity:'student',entityId:'s1',sensitivity:'عادية',route:'/overdue/s1'},
]

export const notifications: Notification[] = [
  {id:'n1',title:'دفعتان تنتظران المراجعة',detail:'راجع الإثباتات قبل تحديث أرصدة الطلاب.',route:'/payments/review',read:false,at:'منذ 12 دقيقة',tone:'warning'},
  {id:'n2',title:'متابعة مالية مصعّدة',detail:'يوسف محمود حسن · تعذر التواصل.',route:'/overdue/s3',read:false,at:'منذ ساعة',tone:'danger'},
  {id:'n3',title:'تم تغيير قاعة جلسة',detail:'المستوى الأول A · قاعة 2.',route:'/sessions/x2',read:true,at:'أمس',tone:'info'},
]

export const messageTemplates: MessageTemplate[] = [
  {id:'m1',title:'تذكير ودي بالسداد',category:'سداد',channel:'WhatsApp',body:'مرحبًا {{الاسم}}، نذكّرك بأن الرصيد المتبقي هو {{المبلغ}} ج. نرجو إتمام السداد في أقرب وقت، وشكرًا لتعاونك.'},
  {id:'m2',title:'تأكيد وعد الدفع',category:'سداد',channel:'SMS',body:'تم تسجيل وعد السداد للطالب {{الاسم}} بتاريخ {{التاريخ}}. شكرًا لتعاونكم.'},
  {id:'m3',title:'تنبيه غياب',category:'حضور',channel:'WhatsApp',body:'نحيطكم علمًا بغياب الطالب {{الاسم}} عن جلسة اليوم. يرجى التواصل معنا عند وجود عذر.'},
  {id:'m4',title:'تغيير موعد جلسة',category:'موعد',channel:'WhatsApp',body:'تم تعديل موعد مجموعة {{المجموعة}} إلى {{التاريخ}} الساعة {{الوقت}} في {{القاعة}}.'},
  {id:'m5',title:'ترحيب بطالب جديد',category:'ترحيب',channel:'WhatsApp',body:'أهلًا {{الاسم}} في أكاديمية النخبة. المجموعة: {{المجموعة}}، وموعد البداية: {{التاريخ}}.'},
]

export const settings: AppSettings = {academyName:'أكاديمية النخبة التعليمية',email:'operations@nexvora.academy',phone:'01000000000',density:'comfortable',theme:'dark'}
