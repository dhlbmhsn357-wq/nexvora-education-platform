import type { AppSettings, AttendanceRecord, AuditEvent, Followup, Group, MessageTemplate, Notification, PaymentSubmission, Session, Student, Teacher } from '../domain/types'

export const students: Student[] = [
  { id:'s1',code:'ST-1001',name:'أحمد محمد علي',phone:'01012345678',guardian:'01011112222',group:'تأسيس A',course:'اللغة العربية',packageName:'شهرية · 8 حصص',paid:700,total:1200,due:'منذ 8 أيام',status:'نشط' },
  { id:'s2',code:'ST-1002',name:'مريم أحمد السيد',phone:'01098765432',guardian:'01033334444',group:'المستوى الأول A',course:'اللغة العربية',packageName:'شهرية · 8 حصص',paid:1200,total:1200,due:'مستوفى',status:'نشط' },
  { id:'s3',code:'ST-1003',name:'يوسف محمود حسن',phone:'01122334455',guardian:'01155556666',group:'تأسيس A',course:'اللغة العربية',packageName:'شهرية · 8 حصص',paid:400,total:1200,due:'منذ 3 أيام',status:'نشط' },
  { id:'s4',code:'ST-1004',name:'نور محمد عبد الله',phone:'01255566778',guardian:'01288889999',group:'المستوى الأول B',course:'الرياضيات',packageName:'شهرية · 12 حصة',paid:900,total:1200,due:'منذ يومين',status:'نشط' },
  { id:'s5',code:'ST-1005',name:'سليم خالد محمود',phone:'01022223333',guardian:'01044445555',group:'',course:'اللغة العربية',packageName:'شهرية · 8 حصص',paid:0,total:1200,due:'موعد السداد 15 أغسطس',status:'نشط' },
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
  {id:'REV-2026-014',studentId:'s1',amount:500,method:'تحويل بنكي',reference:'TRX-260811',paymentDate:'2026-08-11',note:'دفعة أغسطس',proof:{name:'transfer-260811.jpg',type:'image/jpeg',size:184320,dataUrl:''},status:'بانتظار المراجعة',createdAt:'11 أغسطس، 9:42 ص',createdBy:'المحاسب',history:[{id:'r1',title:'تم تسجيل الدفعة ورفع الإثبات',user:'المحاسب',at:'11 أغسطس، 9:42 ص'}]},
  {id:'REV-2026-013',studentId:'s4',amount:300,method:'محفظة إلكترونية',reference:'WAL-88431',paymentDate:'2026-08-10',note:'إثبات محفظة',proof:{name:'wallet-proof.pdf',type:'application/pdf',size:245760,dataUrl:''},status:'بانتظار المراجعة',createdAt:'10 أغسطس، 4:18 م',createdBy:'المحاسب',history:[{id:'r2',title:'تم تسجيل الدفعة ورفع الإثبات',user:'المحاسب',at:'10 أغسطس، 4:18 م'}]},
]

export const audit: AuditEvent[] = [
  {id:'au1',type:'schedule',title:'تم تعديل قاعة جلسة',detail:'المستوى الأول A · قاعة 1 ← قاعة 2',user:'مدير التشغيل',at:'9 أغسطس، 2:20 م'},
  {id:'au2',type:'followup',title:'تم تسجيل متابعة مالية',detail:'أحمد محمد علي · وعد بالدفع',user:'موظف المتابعة',at:'10 أغسطس، 12:10 م'},
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

export const settings: AppSettings = {academyName:'أكاديمية النخبة التعليمية',email:'operations@nexvora.academy',phone:'01000000000',density:'comfortable',theme:'light'}
