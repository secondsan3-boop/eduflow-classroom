/* ==========================================
   EDUFLOW CORE LOGIC & DATA MANAGEMENT (JS)
   ========================================== */

// 1. STATE CONFIGURATION & SYSTEM DATA
const firebaseConfig = {
  apiKey: "AIzaSyCc0xE3rcANxByiYV-6lRh7Rcvg58xm1i8",
  authDomain: "eduflow-db.firebaseapp.com",
  projectId: "eduflow-db",
  storageBucket: "eduflow-db.firebasestorage.app",
  messagingSenderId: "962891234874",
  appId: "1:962891234874:web:98293951cd097eade7bf03",
  measurementId: "G-L0X4MPESN4"
};

// 2. MOCK DATA INITIALIZATION
const INITIAL_MOCK_CLASSES = [
    {
        id: 'class_01',
        name: 'วิทยาการคำนวณ ม.3/1',
        subject: 'คอมพิวเตอร์และสารสนเทศ',
        room: 'LAB 2',
        code: 'EDUF31',
        teacher: 'ครูสมศักดิ์ รักเรียน',
        students: ['std_01', 'std_02', 'std_03']
    },
    {
        id: 'class_02',
        name: 'คณิตศาสตร์ประยุกต์ ม.3',
        subject: 'คณิตศาสตร์และตรรกศาสตร์',
        room: 'ห้องเรียน 421',
        code: 'MATH35',
        teacher: 'ครูอัญชลี เก่งคำนวณ',
        students: ['std_01', 'std_03']
    }
];

const INITIAL_MOCK_ASSIGNMENTS = [
    {
        id: 'assign_01',
        classId: 'class_01',
        title: 'ออกแบบหน้าเว็บไซต์ Portfolio ของตัวเอง',
        desc: 'ให้นักเรียนออกแบบโครงสร้างหน้าเว็บ Portfolio ของตนเองโดยระบุองค์ประกอบสำคัญ ได้แก่:\n1. ส่วนหัวเว็บไซต์ (Header - รูปภาพ ข้อมูลผู้เขียน)\n2. ส่วนเนื้อหาหลัก (Main Content - ประวัติ ผลงานเด่น)\n3. ส่วนข้อมูลติดต่อท้ายหน้า (Footer)\n\nและอธิบายแนวคิดสีสันที่ใช้ในการออกแบบ',
        points: 10,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16) // พรุ่งนี้เวลาปัจจุบัน
    },
    {
        id: 'assign_02',
        classId: 'class_01',
        title: 'แบบฝึกหัดเรื่องลอจิกเกต (Logic Gates)',
        desc: 'ให้นักเรียนตอบคำถามและเขียนตารางความจริง (Truth Table) สำหรับสมการลอจิกเกต:\nF = (A AND B) OR (NOT C) ให้ถูกต้องครบถ้วนพร้อมส่งตัวอย่างการสเก็ตช์ไดอะแกรม',
        points: 20,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16) // อีก 5 วัน
    },
    {
        id: 'assign_03',
        classId: 'class_02',
        title: 'สมการและกราฟพาราโบลาขั้นพื้นฐาน',
        desc: 'ให้วาดกราฟและหาจุดยอดของสมการพาราโบลา y = x^2 - 4x + 3 ลงบนสมุดแล้วอัปโหลดภาพคำตอบ',
        points: 15,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16) // สองวันที่แล้ว (เลยกำหนดส่ง)
    }
];

const INITIAL_MOCK_SUBMISSIONS = [
    {
        id: 'sub_01',
        assignmentId: 'assign_01',
        classId: 'class_01',
        studentId: 'std_01',
        studentName: 'เด็กชายมานะ พากเพียร',
        submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 ชั่วโมงก่อน
        textResponse: 'ส่งงานวิทยาการคำนวณครับ! ผมออกแบบ Portfolio โทนสีเข้ม (Dark Mode) ตัดด้วยสีนีออนฟ้าครับ โครงสร้างมี Header ด้านบนใส่ภาพอวาตาร์ของผม หน้าแรกแสดงผลงานเขียนเว็บ ส่วนท้ายแสดงช่องทางอีเมลและ GitHub ครับ มีการแบ่งสัดส่วนเนื้อหาชัดเจน',
        fileName: 'portfolio_sketch_mana.pdf',
        status: 'submitted', // ยังไม่ตรวจ
        grade: null,
        feedback: ''
    },
    {
        id: 'sub_02',
        assignmentId: 'assign_01',
        classId: 'class_01',
        studentId: 'std_02',
        studentName: 'เด็กหญิงสมศรี ดีเลิศ',
        submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 ชั่วโมงก่อน
        textResponse: 'ส่งผลงานค่ะ ออกแบบ Portfolio ส่วนตัวโดยใช้โทนสีพาสเทลชมพู-ขาว เน้นความมินิมอลสบายตาค่ะ และจัด Layout ให้รองรับ Responsive บนสมาร์ตโฟนด้วยค่ะ',
        fileName: 'somsri_web_mockup.png',
        status: 'graded', // ตรวจแล้ว
        grade: 9.5,
        feedback: 'การออกแบบมินิมอลและจัดสรรพื้นที่ได้ดีมากๆ ครับ! ใส่ใจการตอบสนองบนมือถือด้วย ยอดเยี่ยมมาก!'
    }
];

const MOCK_PEOPLE = {
    class_01: {
        teachers: ['ครูสมศักดิ์ รักเรียน'],
        students: [
            { id: 'std_01', name: 'เด็กชายมานะ พากเพียร' },
            { id: 'std_02', name: 'เด็กหญิงสมศรี ดีเลิศ' },
            { id: 'std_03', name: 'เด็กชายปิติ มีสุข' }
        ]
    },
    class_02: {
        teachers: ['ครูอัญชลี เก่งคำนวณ'],
        students: [
            { id: 'std_01', name: 'เด็กชายมานะ พากเพียร' },
            { id: 'std_03', name: 'เด็กชายปิติ มีสุข' }
        ]
    }
};

// 3. STORAGE & STATE FLOWS
function saveToStorage() {
    localStorage.setItem('eduflow_classes', JSON.stringify(state.classes));
    localStorage.setItem('eduflow_assignments', JSON.stringify(state.assignments));
    localStorage.setItem('eduflow_submissions', JSON.stringify(state.submissions));
}

function loadFromStorage() {
    const localClasses = localStorage.getItem('eduflow_classes');
    const localAssignments = localStorage.getItem('eduflow_assignments');
    const localSubmissions = localStorage.getItem('eduflow_submissions');

    if (localClasses && localAssignments && localSubmissions) {
        state.classes = JSON.parse(localClasses);
        state.assignments = JSON.parse(localAssignments);
        state.submissions = JSON.parse(localSubmissions);
    } else {
        // ใช้ข้อมูล Mock ชุดเริ่มต้นหากไม่มีการบันทึก
        state.classes = INITIAL_MOCK_CLASSES;
        state.assignments = INITIAL_MOCK_ASSIGNMENTS;
        state.submissions = INITIAL_MOCK_SUBMISSIONS;
        saveToStorage();
    }
}

// 4. CORE CONTROLLERS & VIEW TRANSITIONS
function switchRole(role) {
    state.activeRole = role;
    document.body.className = `role-${role}`;
    
    // รีเซ็ตหน้ากลับมาหน้าหลักห้องเรียน ป้องกันบั๊กข้ามสายงาน
    state.currentClassId = null;
    state.activeTab = 'classes';
    
    // อัปเดต UI เมนู
    updateMenuOptions();
    updateUserProfile();
    
    // เรนเดอร์หน้าจอตามบทบาทที่เลือก
    renderApp();
    showToast(`สลับบทบาทการใช้งานเป็น: ${role === 'teacher' ? 'คุณครู' : 'นักเรียน'} 🚀`, 'info');
}

function switchTab(tabName) {
    state.activeTab = tabName;
    state.currentClassId = null; // ออกจากหน้ารายละเอียดห้องเรียนหากคลิกเมนูนอก
    
    // จัดการ Active Menu Button
    document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
    if (tabName === 'classes') document.getElementById('menuBtnClasses').classList.add('active');
    if (tabName === 'todo') document.getElementById('menuBtnTodo').classList.add('active');
    if (tabName === 'analytics') document.getElementById('menuBtnAnalytics').classList.add('active');
    
    renderApp();
}

function switchClassTab(innerTab) {
    state.currentClassTab = innerTab;
    document.querySelectorAll('.inner-nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.inner-panel').forEach(panel => panel.classList.remove('active'));
    
    if (innerTab === 'stream') {
        document.getElementById('innerNavStream').classList.add('active');
        document.getElementById('panelStream').classList.add('active');
        renderClassStream();
    } else {
        document.getElementById('innerNavPeople').classList.add('active');
        document.getElementById('panelPeople').classList.add('active');
        renderClassPeople();
    }
}

function openClassDetail(classId) {
    state.currentClassId = classId;
    state.activeTab = 'class_detail';
    state.currentClassTab = 'stream'; // รีเซ็ตหน้าแรกในห้องเรียนไปที่สตรีมข่าว
    
    // ไฮไลต์ปุ่มเมนูให้จางลงเพราะกำลังดูรายละเอียดคลาส
    document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
    
    renderApp();
}

// 5. UPDATE SUB-VIEWS & PROFILES
function updateMenuOptions() {
    const roleText = document.getElementById('activeRoleText');
    const todoMenuText = document.getElementById('todoMenuText');
    const classesCount = document.getElementById('classesCount');
    const todoCount = document.getElementById('todoCount');
    
    const btnCreate = document.getElementById('btnCreateClass');
    const btnJoin = document.getElementById('btnJoinClass');
    const btnAssign = document.getElementById('btnCreateAssignment');

    if (state.activeRole === 'teacher') {
        roleText.textContent = 'บทบาท: คุณครู';
        todoMenuText.textContent = 'งานที่ต้องตรวจ';
        
        btnCreate.classList.remove('hidden');
        btnJoin.classList.add('hidden');
        if (btnAssign) btnAssign.classList.remove('hidden');
        
        // นับห้องเรียนที่ครูสอน (ตามรายวิชาที่มีครูตรงกัน)
        const myClasses = state.classes.filter(c => c.teacher === state.currentUser.teacher.name);
        classesCount.textContent = myClasses.length;
        
        // นับการส่งงานที่รอการตรวจ
        const pendingGrades = state.submissions.filter(s => s.status === 'submitted');
        todoCount.textContent = pendingGrades.length;
        todoCount.className = pendingGrades.length > 0 ? "menu-badge warning" : "menu-badge";
        
    } else {
        roleText.textContent = 'บทบาท: นักเรียน';
        todoMenuText.textContent = 'งานที่ต้องส่ง';
        
        btnCreate.classList.add('hidden');
        btnJoin.classList.remove('hidden');
        if (btnAssign) btnAssign.classList.add('hidden');
        
        // นับคลาสที่นักเรียนลงทะเบียนเรียน
        const enrolledClasses = state.classes.filter(c => c.students.includes(state.currentUser.student.id));
        classesCount.textContent = enrolledClasses.length;
        
        // นับงานค้างส่ง
        const mySubmissions = state.submissions.filter(s => s.studentId === state.currentUser.student.id);
        const enrolledClassIds = enrolledClasses.map(c => c.id);
        const myAssignments = state.assignments.filter(a => enrolledClassIds.includes(a.classId));
        
        const mySubmittedAssignIds = mySubmissions.map(s => s.assignmentId);
        const pendingSubmissions = myAssignments.filter(a => !mySubmittedAssignIds.includes(a.id));
        
        todoCount.textContent = pendingSubmissions.length;
        todoCount.className = pendingSubmissions.length > 0 ? "menu-badge warning" : "menu-badge";
    }
}

function updateUserProfile() {
    const avatar = document.getElementById('userAvatar');
    const name = document.getElementById('userName');
    const badge = document.getElementById('userRoleBadge');

    if (state.activeRole === 'teacher') {
        avatar.textContent = state.currentUser.teacher.avatar;
        name.textContent = state.currentUser.teacher.name;
        badge.textContent = state.currentUser.teacher.badge;
    } else {
        avatar.textContent = state.currentUser.student.avatar;
        name.textContent = state.currentUser.student.name;
        badge.textContent = state.currentUser.student.badge;
    }
}

// 6. VIEW ROUTING & GENERAL RENDERING
function renderApp() {
    // ปิดทุกส่วนเนื้อหาหลักก่อน
    document.querySelectorAll('.content-view').forEach(view => view.classList.remove('active'));
    
    // เปิดเฉพาะ View ที่ถูกเลือก
    if (state.activeTab === 'classes') {
        document.getElementById('viewClasses').classList.add('active');
        renderClassesView();
    } else if (state.activeTab === 'todo') {
        document.getElementById('viewTodo').classList.add('active');
        renderTodoView();
    } else if (state.activeTab === 'analytics') {
        document.getElementById('viewAnalytics').classList.add('active');
        renderAnalyticsView();
    } else if (state.activeTab === 'class_detail') {
        document.getElementById('viewClassDetails').classList.add('active');
        renderClassDetailsView();
    }
    
    // อัปเดตตัวนับและข้อมูลประกอบด้านข้างเมนูสม่ำเสมอ
    updateMenuOptions();
}

// 7. RENDER SUB-VIEWS FUNCTIONALITIES

// A. RENDER CLASSES DASHBOARD
function renderClassesView() {
    const grid = document.getElementById('classesGrid');
    const viewTitle = document.getElementById('classesViewTitle');
    const viewDesc = document.getElementById('classesViewDesc');
    
    grid.innerHTML = '';
    
    let activeClasses = [];
    if (state.activeRole === 'teacher') {
        viewTitle.textContent = 'ห้องเรียนที่คุณสอน 🏫';
        viewDesc.textContent = 'จัดการคลาสเรียน การมอบหมายงาน และติดตามนักเรียนของคุณได้ง่ายๆ';
        activeClasses = state.classes.filter(c => c.teacher === state.currentUser.teacher.name);
    } else {
        viewTitle.textContent = 'ชั้นเรียนของฉัน 🎓';
        viewDesc.textContent = 'ยินดีต้อนรับกลับมา! ตรวจสอบงานมอบหมายใหม่ๆ จากห้องเรียนที่คุณลงทะเบียน';
        activeClasses = state.classes.filter(c => c.students.includes(state.currentUser.student.id));
    }

    if (activeClasses.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-emoji">🌌</div>
                <h4>ไม่มีชั้นเรียนแสดงผล</h4>
                <p>${state.activeRole === 'teacher' ? 'คุณยังไม่ได้สร้างห้องเรียนเลย กดปุ่มด้านขวาบนเพื่อริเริ่มสร้างคลาสเรียนใหม่!' : 'คุณยังไม่เคยเข้าร่วมคลาสใดๆ สอบถามรหัสผ่านจากครูเพื่อลงทะเบียนเข้าคลาส!'}</p>
            </div>
        `;
        return;
    }

    activeClasses.forEach((cls, idx) => {
        // สุ่มดีไซน์ gradient สวยงาม
        const gradClass = `grad-${(idx % 4) + 1}`;
        const totalStudents = cls.students ? cls.students.length : 0;
        
        // จำนวนงานทั้งหมดในชั้นนี้
        const totalAssignments = state.assignments.filter(a => a.classId === cls.id).length;

        const card = document.createElement('div');
        card.className = 'class-card';
        card.innerHTML = `
            <div class="class-card-header ${gradClass}">
                <span class="card-subject-tag">${cls.subject}</span>
                <h3 class="card-title" title="${cls.name}">${cls.name}</h3>
            </div>
            <div class="class-card-body">
                <div class="card-meta-row">
                    <span>รหัสห้องเรียน:</span>
                    <span class="class-code-badge">${cls.code}</span>
                </div>
                <div class="card-meta-row" style="margin-top: 8px;">
                    <span>งานมอบหมาย: ${totalAssignments} งาน</span>
                    <span>ห้องเรียน: ${cls.room || 'ไม่มีข้อมูล'}</span>
                </div>
                
                <div class="card-footer">
                    <div class="instructor-info">
                        <div class="avatar-sm">🧑‍🏫</div>
                        <span class="instructor-name">${cls.teacher}</span>
                    </div>
                    <button class="card-enter-btn" onclick="openClassDetail('${cls.id}')">
                        <span>เข้าสู่ห้อง</span>
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// B. RENDER CLASS DETAIL VIEW
function renderClassDetailsView() {
    const cls = state.classes.find(c => c.id === state.currentClassId);
    if (!cls) return;

    // อัปเดตข้อมูลแบนเนอร์วิชา
    document.getElementById('classDetailName').textContent = cls.name;
    document.getElementById('classDetailSubject').textContent = cls.subject;
    document.getElementById('classDetailCode').textContent = cls.code;
    document.getElementById('classDetailRoom').textContent = `ห้อง: ${cls.room || 'ไม่มีระบุ'}`;
    
    const totalStudents = cls.students ? cls.students.length : 0;
    document.getElementById('classDetailStudentsCount').textContent = `นักเรียน: ${totalStudents} คน`;

    // ซ่อน/แสดง ปุ่มสั่งงานสำหรับคุณครู
    const btnAssign = document.getElementById('btnCreateAssignment');
    if (state.activeRole === 'teacher') {
        btnAssign.classList.remove('hidden');
    } else {
        btnAssign.classList.add('hidden');
    }

    // สลับไปยัง Inner Tab ที่เปิดอยู่
    switchClassTab(state.currentClassTab);
}

function renderClassStream() {
    const list = document.getElementById('classAssignmentsList');
    list.innerHTML = '';

    const classAssignments = state.assignments.filter(a => a.classId === state.currentClassId);

    // เรียงตาม Due Date จากก่อนหน้าไปไกล
    classAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    if (classAssignments.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-emoji">🎈</div>
                <h4>ไม่มีรายการสั่งงานในวิชานี้</h4>
                <p>ดีใจจัง! ปล่อยสมองให้โล่งหรือเพลิดเพลินกับวันหยุดได้ตามสบาย</p>
            </div>
        `;
        return;
    }

    classAssignments.forEach(assign => {
        const item = document.createElement('div');
        item.className = 'assignment-item';
        
        const isLate = new Date(assign.dueDate) < new Date();
        const formattedDate = formatDate(assign.dueDate);
        
        let actionHTML = '';

        if (state.activeRole === 'teacher') {
            // ครูดูสถิติงานนี้โดยรวม
            const subs = state.submissions.filter(s => s.assignmentId === assign.id);
            const gradedCount = subs.filter(s => s.status === 'graded').length;
            const submittedCount = subs.filter(s => s.status === 'submitted').length;
            
            actionHTML = `
                <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                    <span class="meta-pill success">ส่งแล้ว ${subs.length} คน (ตรวจแล้ว ${gradedCount})</span>
                    <button class="btn btn-secondary btn-sm" onclick="viewAssignmentSubmissions('${assign.id}')" style="padding:6px 12px; font-size:0.8rem;">
                        ตรวจงานนักเรียน 🧐
                    </button>
                </div>
            `;
        } else {
            // นักเรียนดูสถานะงานส่งของตน
            const mySub = state.submissions.find(s => s.assignmentId === assign.id && s.studentId === state.currentUser.student.id);
            
            if (mySub) {
                if (mySub.status === 'graded') {
                    actionHTML = `
                        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
                            <span class="meta-pill success">ตรวจแล้ว: ${mySub.grade} / ${assign.points} คะแนน</span>
                            <span class="meta-pill" style="max-width:180px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" title="${mySub.feedback}">ติชม: "${mySub.feedback || '-'}"</span>
                        </div>
                    `;
                } else {
                    actionHTML = `
                        <span class="meta-pill success">ส่งผลงานแล้ว (รอครูตรวจ)</span>
                    `;
                }
            } else {
                actionHTML = `
                    <button class="btn btn-primary" onclick="openSubmitAssignmentModal('${assign.id}')" style="padding:8px 16px; font-size:0.85rem;">
                        ส่งงาน 📤
                    </button>
                `;
            }
        }

        item.innerHTML = `
            <div class="assign-left">
                <div class="assign-icon">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div class="assign-details">
                    <h4>${assign.title}</h4>
                    <p class="assign-desc">${assign.desc}</p>
                    <div class="assign-meta-row">
                        <span class="meta-pill ${isLate ? 'danger' : 'warning'}">กำหนดส่ง: ${formattedDate} ${isLate ? '(เลยกำหนด)' : ''}</span>
                        <span class="meta-pill">คะแนนเต็ม: ${assign.points} คะแนน</span>
                    </div>
                </div>
            </div>
            <div class="assign-right">
                ${actionHTML}
            </div>
        `;
        list.appendChild(item);
    });
}

function renderClassPeople() {
    const teachersList = document.getElementById('classTeachersList');
    const studentsList = document.getElementById('classStudentsList');
    
    teachersList.innerHTML = '';
    studentsList.innerHTML = '';

    const cls = state.classes.find(c => c.id === state.currentClassId);
    if (!cls) return;

    // ครูผู้สอน (Mock หรือครูเจ้าของห้อง)
    const teacherDiv = document.createElement('div');
    teacherDiv.className = 'person-item';
    teacherDiv.innerHTML = `
        <div class="avatar-sm" style="font-size:1.1rem;">🧑‍🏫</div>
        <span class="person-name">${cls.teacher} (ผู้สอน)</span>
    `;
    teachersList.appendChild(teacherDiv);

    // นักเรียนที่ลงทะเบียนเรียน
    const studentsInClass = MOCK_PEOPLE[cls.id] ? MOCK_PEOPLE[cls.id].students : [];
    
    if (studentsInClass.length === 0) {
        studentsList.innerHTML = `<p class="text-muted" style="font-size:0.9rem; padding-left:8px;">ยังไม่มีสมาชิกนักเรียนในคลาสนี้</p>`;
        return;
    }

    studentsInClass.forEach(student => {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'person-item';
        
        // ไฮไลท์แสดงตนเอง
        const isMe = state.activeRole === 'student' && student.id === state.currentUser.student.id;

        studentDiv.innerHTML = `
            <div class="avatar-sm" style="font-size:1.1rem;">🎓</div>
            <span class="person-name">${student.name} ${isMe ? '<strong>(ฉัน)</strong>' : ''}</span>
        `;
        studentsList.appendChild(studentDiv);
    });
}

// C. RENDER TO-DO / GRADING LIST VIEW
function renderTodoView() {
    const list = document.getElementById('todoList');
    const title = document.getElementById('todoViewTitle');
    const desc = document.getElementById('todoViewDesc');
    const tabsContainer = document.getElementById('studentTodoTabs');
    
    list.innerHTML = '';
    
    if (state.activeRole === 'teacher') {
        title.textContent = 'งานที่รอคอยการตรวจให้คะแนน 🧐';
        desc.textContent = 'จัดการรหัสชั้นเรียน และประเมินงานส่งที่ยังไม่ได้รับการตรวจเพื่อให้ฟีดแบ็ก';
        tabsContainer.classList.add('hidden'); // แถบ filter ย่อยใช้เฉพาะฝั่งนักเรียน
        
        // ค้นหาการส่งงานที่ยังมีสถานะ 'submitted' (ยังไม่ตรวจ)
        const pendingSubmissions = state.submissions.filter(s => s.status === 'submitted');
        
        if (pendingSubmissions.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-emoji">💖</div>
                    <h4>ตรวจงานครบเรียบร้อยแล้ว!</h4>
                    <p>ระบบลื่นไหล คุณครูทำงานได้รวดเร็วมากครับ ปรบมือรัวๆ!</p>
                </div>
            `;
            return;
        }

        pendingSubmissions.forEach(sub => {
            const assign = state.assignments.find(a => a.id === sub.assignmentId);
            const cls = state.classes.find(c => c.id === assign.classId);
            if (!assign || !cls) return;

            const item = document.createElement('div');
            item.className = 'assignment-item';
            item.innerHTML = `
                <div class="assign-left">
                    <div class="assign-icon" style="color: var(--primary); background: var(--primary-glow);">
                        📤
                    </div>
                    <div class="assign-details">
                        <h4>${assign.title}</h4>
                        <p class="assign-desc" style="color: var(--text-primary); font-weight:500;">คำตอบโดย: ${sub.studentName}</p>
                        <div class="assign-meta-row">
                            <span class="class-title-tag">${cls.name}</span>
                            <span class="meta-pill">กำหนด: ${formatDate(assign.dueDate)}</span>
                            <span class="meta-pill danger">คะแนนเต็ม: ${assign.points} คะแนน</span>
                        </div>
                    </div>
                </div>
                <div class="assign-right">
                    <button class="btn btn-success" onclick="openGradeModal('${sub.id}')">
                        ตรวจผลงานประเมิน
                    </button>
                </div>
            `;
            list.appendChild(item);
        });

    } else {
        // ฝั่งนักเรียน: แสดงแท็บ Assigned, Submitted, Graded
        title.textContent = 'รายงานความก้าวหน้าและการบ้านของคุณ 🎓';
        desc.textContent = 'ตรวจสอบงานค้างส่ง งานที่จัดส่งไปแล้ว และคะแนนที่คุณได้รับจากครูผู้สอน';
        tabsContainer.classList.remove('hidden');
        
        const myClasses = state.classes.filter(c => c.students.includes(state.currentUser.student.id));
        const myClassIds = myClasses.map(c => c.id);
        const myAllAssignments = state.assignments.filter(a => myClassIds.includes(a.classId));
        
        const mySubmissions = state.submissions.filter(s => s.studentId === state.currentUser.student.id);
        const mySubmitsMap = {};
        mySubmissions.forEach(s => { mySubmitsMap[s.assignmentId] = s; });

        let filteredList = [];

        if (state.activeStudentTodoFilter === 'assigned') {
            // ไม่ส่งและยังไม่ตรวจ
            filteredList = myAllAssignments.filter(a => !mySubmitsMap[a.id]);
        } else if (state.activeStudentTodoFilter === 'submitted') {
            // ส่งแล้วและยังไม่ตรวจ
            filteredList = myAllAssignments.filter(a => mySubmitsMap[a.id] && mySubmitsMap[a.id].status === 'submitted');
        } else {
            // ส่งแล้วและตรวจแล้ว
            filteredList = myAllAssignments.filter(a => mySubmitsMap[a.id] && mySubmitsMap[a.id].status === 'graded');
        }

        if (filteredList.length === 0) {
            let msg = '';
            let emoji = '🔮';
            if (state.activeStudentTodoFilter === 'assigned') {
                msg = 'เยี่ยมเลย! ไม่มีงานค้างส่งในขณะนี้';
                emoji = '☀️';
            } else if (state.activeStudentTodoFilter === 'submitted') {
                msg = 'ยังไม่มีงานที่คุณส่งค้างการรอตรวจ';
                emoji = '🕊️';
            } else {
                msg = 'ยังไม่มีงานที่ได้รับการประเมินผลคะแนนย้อนกลับ';
                emoji = '🍀';
            }
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-emoji">${emoji}</div>
                    <h4>ไม่พบคู่รายการงานค้นหา</h4>
                    <p>${msg}</p>
                </div>
            `;
            return;
        }

        filteredList.forEach(assign => {
            const cls = state.classes.find(c => c.id === assign.classId);
            const sub = mySubmitsMap[assign.id];
            
            const isLate = new Date(assign.dueDate) < new Date();
            const item = document.createElement('div');
            item.className = 'assignment-item';
            
            let badgeHTML = '';
            let btnActionHTML = '';
            
            if (state.activeStudentTodoFilter === 'assigned') {
                badgeHTML = `<span class="meta-pill ${isLate ? 'danger' : 'warning'}">กำหนดส่ง: ${formatDate(assign.dueDate)}</span>`;
                btnActionHTML = `<button class="btn btn-primary" onclick="openSubmitAssignmentModal('${assign.id}')">ส่งงานด่วน 🚀</button>`;
            } else if (state.activeStudentTodoFilter === 'submitted') {
                badgeHTML = `<span class="meta-pill success">ส่งแล้วเมื่อ: ${formatDate(sub.submittedAt)} (รอตรวจ)</span>`;
            } else {
                badgeHTML = `
                    <span class="meta-pill success">คะแนน: ${sub.grade} / ${assign.points} คะแนน</span>
                    <span class="meta-pill warning" style="max-width:300px; text-overflow:ellipsis; overflow:hidden;" title="${sub.feedback}">ฟีดแบ็ก: "${sub.feedback}"</span>
                `;
            }

            item.innerHTML = `
                <div class="assign-left">
                    <div class="assign-icon" style="color: var(--secondary); background: var(--secondary-glow);">
                        📝
                    </div>
                    <div class="assign-details">
                        <h4>${assign.title}</h4>
                        <div class="assign-meta-row" style="margin-top:6px;">
                            <span class="class-title-tag">${cls.name}</span>
                            ${badgeHTML}
                        </div>
                    </div>
                </div>
                <div class="assign-right">
                    ${btnActionHTML}
                </div>
            `;
            list.appendChild(item);
        });
    }
}

function filterStudentTodo(filterType) {
    state.activeStudentTodoFilter = filterType;
    document.querySelectorAll('.todo-tab').forEach(btn => btn.classList.remove('active'));
    
    if (filterType === 'assigned') document.getElementById('tabAssigned').classList.add('active');
    if (filterType === 'submitted') document.getElementById('tabSubmitted').classList.add('active');
    if (filterType === 'graded') document.getElementById('tabGraded').classList.add('active');
    
    renderTodoView();
}

// D. RENDER ANALYTICS VIEW
function renderAnalyticsView() {
    const dashboard = document.getElementById('analyticsDashboard');
    dashboard.innerHTML = '';

    if (state.activeRole === 'teacher') {
        // วิเคราะห์ภาพรวมสำหรับครู
        const totalCls = state.classes.filter(c => c.teacher === state.currentUser.teacher.name).length;
        const totalAssign = state.assignments.length;
        const pendingCount = state.submissions.filter(s => s.status === 'submitted').length;
        const totalSubmits = state.submissions.length;
        
        // เปอร์เซ็นต์การตรวจเสร็จ
        const gradedCount = state.submissions.filter(s => s.status === 'graded').length;
        const gradeRatio = totalSubmits > 0 ? Math.round((gradedCount / totalSubmits) * 100) : 100;

        dashboard.innerHTML = `
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="card-stat-label">ห้องเรียนที่สอนทั้งหมด</div>
                    <div class="card-stat-value">${totalCls}</div>
                    <div class="card-stat-trend">ใช้งานแบบ Local Storage</div>
                </div>
                <div class="analytics-card cyan">
                    <div class="card-stat-label">งานมอบหมายทั้งหมด</div>
                    <div class="card-stat-value">${totalAssign}</div>
                    <div class="card-stat-trend">คลาสวิทยาการคอมพิวเตอร์</div>
                </div>
                <div class="analytics-card green">
                    <div class="card-stat-label">ความคืบหน้าการตรวจงาน</div>
                    <div class="card-stat-value">${gradeRatio}%</div>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${gradeRatio}%;"></div>
                    </div>
                </div>
                <div class="analytics-card amber">
                    <div class="card-stat-label">การบ้านค้างตรวจครู</div>
                    <div class="card-stat-value">${pendingCount}</div>
                    <div class="card-stat-trend" style="color:var(--danger)">สะสมงานรอนัดหมาย</div>
                </div>
            </div>

            <div class="analytic-charts-row">
                <div class="chart-panel">
                    <h4>อัตราการส่งงานของนักเรียน (แบ่งรายวิชา)</h4>
                    <div class="bar-chart-mock" id="analyticsBarChart">
                        <!-- Dynamic generated chart columns -->
                    </div>
                </div>
                <div class="chart-panel" style="display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
                    <div style="font-size:3rem; margin-bottom:12px;">🌟</div>
                    <h4>เกรดเฉลี่ยสูงสุดของห้อง</h4>
                    <p style="font-size:1.8rem; font-weight:700; color:var(--secondary); margin-top:8px;">89.4 %</p>
                    <p class="text-muted" style="font-size:0.8rem; margin-top:8px; max-width:200px;">
                        มีพัฒนาการสูงขึ้นเฉลี่ย 3.5% เทียบจากงานส่งครั้งแรก
                    </p>
                </div>
            </div>
        `;
        
        // วาดชาร์ตแท่ง
        setTimeout(() => {
            const chart = document.getElementById('analyticsBarChart');
            if (!chart) return;
            chart.innerHTML = '';
            
            state.assignments.slice(0, 5).forEach(assign => {
                const subs = state.submissions.filter(s => s.assignmentId === assign.id).length;
                // คำนวณความสูงจำลอง
                const heightPercentage = Math.min(100, Math.max(10, subs * 35)); 
                
                const col = document.createElement('div');
                col.className = 'chart-bar-container';
                col.innerHTML = `
                    <span class="chart-bar-value">${subs} คน</span>
                    <div class="chart-bar" style="height: ${heightPercentage}%;"></div>
                    <span class="chart-bar-label" title="${assign.title}">${assign.title}</span>
                `;
                chart.appendChild(col);
            });
        }, 100);

    } else {
        // วิเคราะห์ภาพรวมสำหรับนักเรียน
        const myClasses = state.classes.filter(c => c.students.includes(state.currentUser.student.id));
        const myClassIds = myClasses.map(c => c.id);
        const myAllAssignments = state.assignments.filter(a => myClassIds.includes(a.classId));
        
        const mySubmissions = state.submissions.filter(s => s.studentId === state.currentUser.student.id);
        const mySubmittedAssignIds = mySubmissions.map(s => s.assignmentId);
        
        const totalWork = myAllAssignments.length;
        const doneWork = mySubmissions.length;
        const completionRate = totalWork > 0 ? Math.round((doneWork / totalWork) * 100) : 100;
        
        // คำนวณเกรดหรือคะแนนเฉลี่ย
        const gradedSubmissions = mySubmissions.filter(s => s.status === 'graded');
        let avgScore = 0;
        if (gradedSubmissions.length > 0) {
            let totalGot = 0;
            let totalMax = 0;
            gradedSubmissions.forEach(s => {
                const assign = state.assignments.find(a => a.id === s.assignmentId);
                if (assign) {
                    totalGot += s.grade;
                    totalMax += assign.points;
                }
            });
            avgScore = totalMax > 0 ? Math.round((totalGot / totalMax) * 100) : 0;
        } else {
            avgScore = 0;
        }

        dashboard.innerHTML = `
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="card-stat-label">วิชาเรียนทั้งหมดของคุณ</div>
                    <div class="card-stat-value">${myClasses.length}</div>
                    <div class="card-stat-trend">ห้องหลัก ม.3 คอมพิวเตอร์</div>
                </div>
                <div class="analytics-card cyan">
                    <div class="card-stat-label">ทำการบ้านเสร็จสิ้นแล้ว</div>
                    <div class="card-stat-value">${doneWork} / ${totalWork}</div>
                    <div class="card-stat-trend">นับรวมงานส่งทั้งหมด</div>
                </div>
                <div class="analytics-card green">
                    <div class="card-stat-label">ความสำเร็จในการส่งงาน</div>
                    <div class="card-stat-value">${completionRate}%</div>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${completionRate}%; background:var(--success);"></div>
                    </div>
                </div>
                <div class="analytics-card amber">
                    <div class="card-stat-label">คะแนนเฉลี่ยโดยรวม</div>
                    <div class="card-stat-value">${avgScore}%</div>
                    <div class="card-stat-trend">คำนวณจากงานส่งที่ตรวจเสร็จ</div>
                </div>
            </div>

            <div class="analytic-charts-row" style="grid-template-columns: 1fr;">
                <div class="chart-panel">
                    <h4>ตารางวิเคราะห์การส่งงานประจำบุคคล</h4>
                    <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom: 20px;">รายชื่องานแบ่งตามหมวดหมู่เพื่อจัดสรรกิจกรรมการทำโครงงานส่วนตัว</p>
                    <table style="width:100%; border-collapse: collapse; text-align:left;">
                        <thead>
                            <tr style="border-bottom:1px solid var(--border-color); color:var(--text-secondary); font-size:0.85rem;">
                                <th style="padding:12px 8px;">ชื่องานมอบหมาย</th>
                                <th style="padding:12px 8px;">สถานะ</th>
                                <th style="padding:12px 8px; text-align:right;">คะแนนที่ได้</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${myAllAssignments.map(assign => {
                                const sub = mySubmissions.find(s => s.assignmentId === assign.id);
                                let statusHTML = '';
                                let scoreHTML = '';
                                
                                if (sub) {
                                    if (sub.status === 'graded') {
                                        statusHTML = `<span class="meta-pill success" style="font-size:0.75rem;">ตรวจและประเมินแล้ว</span>`;
                                        scoreHTML = `${sub.grade} / ${assign.points}`;
                                    } else {
                                        statusHTML = `<span class="meta-pill info" style="font-size:0.75rem;">ส่งแล้ว (รอตรวจ)</span>`;
                                        scoreHTML = `- / ${assign.points}`;
                                    }
                                } else {
                                    const isLate = new Date(assign.dueDate) < new Date();
                                    statusHTML = `<span class="meta-pill ${isLate ? 'danger' : 'warning'}" style="font-size:0.75rem;">${isLate ? 'เกินกำหนดส่ง' : 'ยังไม่ส่ง'}</span>`;
                                    scoreHTML = `ค้างงาน / ${assign.points}`;
                                }
                                
                                return `
                                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.03); font-size:0.9rem;">
                                        <td style="padding:14px 8px; font-weight:600;">${assign.title}</td>
                                        <td style="padding:14px 8px;">${statusHTML}</td>
                                        <td style="padding:14px 8px; text-align:right; font-family:monospace; font-weight:700;">${scoreHTML}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
}

// 8. FORM HANDLERS & MODAL ACTIONS

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        
        // ถ้าเป็น Modal สั่งงาน มอบค่าเริ่มต้นวันที่สั่งส่ง (7 วันถัดไป)
        if (modalId === 'modalCreateAssignment') {
            const dateInput = document.getElementById('assignDueDate');
            if (dateInput) {
                const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                nextWeek.setMinutes(nextWeek.getMinutes() - nextWeek.getTimezoneOffset());
                dateInput.value = nextWeek.toISOString().slice(0, 16);
            }
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// A. สร้างชั้นเรียน (ครู)
function handleCreateClass(event) {
    event.preventDefault();
    
    const className = document.getElementById('newClassName').value.trim();
    const subject = document.getElementById('newClassSubject').value.trim();
    const room = document.getElementById('newClassRoom').value.trim() || 'ไม่มีระบุห้อง';

    // สุ่ม Class Code 6 หลักตัวพิมพ์ใหญ่
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomCode = '';
    for (let i = 0; i < 6; i++) {
        randomCode += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    const newClass = {
        id: `class_${Date.now()}`,
        name: className,
        subject: subject,
        room: room,
        code: randomCode,
        teacher: state.currentUser.teacher.name,
        students: []
    };

    state.classes.push(newClass);
    
    // อัปเดตรายชื่อคนในคลาสจำลอง
    MOCK_PEOPLE[newClass.id] = {
        teachers: [state.currentUser.teacher.name],
        students: []
    };

    saveToStorage();
    closeModal('modalCreateClass');
    
    // ล้างค่าในฟอร์ม
    document.getElementById('formCreateClass').reset();
    
    // นำเข้าห้องเรียนใหม่ทันที
    openClassDetail(newClass.id);
    showToast(`สร้างห้องเรียน "${className}" สำเร็จเรียบร้อยแล้ว! 🏫`, 'success');
}

// B. เข้าร่วมชั้นเรียน (นักเรียน)
function handleJoinClass(event) {
    event.preventDefault();
    const code = document.getElementById('joinClassCode').value.trim().toUpperCase();
    
    const cls = state.classes.find(c => c.code === code);
    if (!cls) {
        showToast('ไม่พบห้องเรียนตามรหัสที่ระบุ โปรดตรวจสอบรหัสผ่านอีกครั้ง!', 'error');
        return;
    }

    const studentId = state.currentUser.student.id;
    if (cls.students.includes(studentId)) {
        showToast('คุณได้เป็นสมาชิกห้องเรียนนี้อยู่แล้ว!', 'info');
        closeModal('modalJoinClass');
        return;
    }

    // เพิ่มนักเรียนเข้าคลาส
    cls.students.push(studentId);
    
    // เชื่อมคนใน MOCK PEOPLE
    if (!MOCK_PEOPLE[cls.id]) {
        MOCK_PEOPLE[cls.id] = { teachers: [cls.teacher], students: [] };
    }
    MOCK_PEOPLE[cls.id].students.push({
        id: studentId,
        name: state.currentUser.student.name
    });

    saveToStorage();
    closeModal('modalJoinClass');
    document.getElementById('formJoinClass').reset();
    
    openClassDetail(cls.id);
    showToast(`เข้าร่วมคลาสเรียน "${cls.name}" เรียบร้อยแล้ว! 🎓`, 'success');
}

// C. สร้างงานสั่งการบ้าน (ครู)
function handleCreateAssignment(event) {
    event.preventDefault();
    
    const title = document.getElementById('assignTitle').value.trim();
    const desc = document.getElementById('assignDesc').value.trim();
    const points = parseInt(document.getElementById('assignPoints').value);
    const dueDate = document.getElementById('assignDueDate').value;

    const newAssign = {
        id: `assign_${Date.now()}`,
        classId: state.currentClassId,
        title: title,
        desc: desc,
        points: points,
        dueDate: dueDate
    };

    state.assignments.push(newAssign);
    saveToStorage();
    
    closeModal('modalCreateAssignment');
    document.getElementById('formCreateAssignment').reset();
    
    renderClassStream();
    showToast(`ส่งงานสั่งการบ้านเรื่อง "${title}" แล้ว! 📝`, 'success');
}

// D. อัปเดตชื่อไฟล์จำลองบนหน้าจอส่งงาน
function updateMockFileName(input) {
    const text = document.getElementById('fileUploadText');
    if (input.files && input.files[0]) {
        text.textContent = `เลือกไฟล์สำเร็จ: ${input.files[0].name}`;
        text.style.color = 'var(--secondary)';
    } else {
        text.textContent = 'คลิกเพื่ออัปโหลดไฟล์ (PDF, ZIP, PNG, JPG)';
        text.style.color = '';
    }
}

// E. หน้าต่างเปิดส่งงาน
function openSubmitAssignmentModal(assignmentId) {
    const assign = state.assignments.find(a => a.id === assignmentId);
    if (!assign) return;

    const info = document.getElementById('submitInfoPanel');
    info.innerHTML = `
        <h4>งาน: ${assign.title}</h4>
        <p style="margin-bottom:8px;">คำชี้แจง: ${assign.desc}</p>
        <div style="font-size:0.8rem; color:var(--text-secondary); display:flex; gap:16px;">
            <span>คะแนนเต็ม: <strong>${assign.points}</strong> คะแนน</span>
            <span>กำหนด: <strong>${formatDate(assign.dueDate)}</strong></span>
        </div>
    `;

    document.getElementById('submitAssignmentId').value = assign.id;
    document.getElementById('submitClassId').value = assign.classId;
    
    // รีเซ็ตค่าจำลอง
    document.getElementById('submitText').value = '';
    document.getElementById('submitFile').value = '';
    document.getElementById('fileUploadText').textContent = 'คลิกเพื่ออัปโหลดไฟล์ (PDF, ZIP, PNG, JPG)';
    document.getElementById('fileUploadText').style.color = '';

    openModal('modalSubmitAssignment');
}

// F. ส่งงานนักเรียนเสร็จสิ้น
function handleSubmitAssignment(event) {
    event.preventDefault();
    
    const assignId = document.getElementById('submitAssignmentId').value;
    const classId = document.getElementById('submitClassId').value;
    const text = document.getElementById('submitText').value.trim();
    const fileInput = document.getElementById('submitFile');
    
    let mockFileName = '';
    if (fileInput.files && fileInput.files[0]) {
        mockFileName = fileInput.files[0].name;
    } else {
        mockFileName = 'ข้อคำถามทั่วไป-ไม่มีไฟล์แนบ.txt';
    }

    // ลบการส่งงานอันเดิมหากเคยส่งมาก่อน
    state.submissions = state.submissions.filter(s => !(s.assignmentId === assignId && s.studentId === state.currentUser.student.id));

    const newSub = {
        id: `sub_${Date.now()}`,
        assignmentId: assignId,
        classId: classId,
        studentId: state.currentUser.student.id,
        studentName: state.currentUser.student.name,
        submittedAt: new Date().toISOString(),
        textResponse: text,
        fileName: mockFileName,
        status: 'submitted',
        grade: null,
        feedback: ''
    };

    state.submissions.push(newSub);
    saveToStorage();
    
    closeModal('modalSubmitAssignment');
    
    // รีเรนเดอร์ข้อมูล
    if (state.activeTab === 'class_detail') {
        renderClassStream();
    } else if (state.activeTab === 'todo') {
        renderTodoView();
    }
    
    showToast('ส่งคำตอบการบ้านสำเร็จเรียบร้อย! 🚀 ขอให้ได้เกรดดีๆ ครับ', 'success');
}

// G. ตรวจงาน (เปิดหน้าต่างกรอกคะแนน)
function openGradeModal(submissionId) {
    const sub = state.submissions.find(s => s.id === submissionId);
    if (!sub) return;

    const assign = state.assignments.find(a => a.id === sub.assignmentId);
    if (!assign) return;

    document.getElementById('gradeSubmissionId').value = sub.id;
    document.getElementById('gradeStudentName').textContent = `ผู้เรียน: ${sub.studentName}`;
    document.getElementById('gradeSubmitTime').textContent = `ส่งคำตอบเมื่อ: ${formatDate(sub.submittedAt)}`;
    document.getElementById('gradeSubmittedText').textContent = sub.textResponse;
    document.getElementById('gradeMaxPoints').textContent = assign.points;

    const attachBox = document.getElementById('gradeAttachmentBox');
    if (sub.fileName) {
        attachBox.classList.remove('hidden');
        document.getElementById('gradeAttachmentName').textContent = sub.fileName;
    } else {
        attachBox.classList.add('hidden');
    }

    // ค่าเริ่มต้นคะแนน
    document.getElementById('gradeScore').value = assign.points;
    document.getElementById('gradeScore').max = assign.points;
    document.getElementById('gradeFeedback').value = '';

    openModal('modalGradeSubmission');
}

// H. ส่งผลการตรวจงานให้คะแนน
function handleGradeSubmission(event) {
    event.preventDefault();
    
    const subId = document.getElementById('gradeSubmissionId').value;
    const score = parseFloat(document.getElementById('gradeScore').value);
    const feedback = document.getElementById('gradeFeedback').value.trim();

    const sub = state.submissions.find(s => s.id === subId);
    if (!sub) return;

    const assign = state.assignments.find(a => a.id === sub.assignmentId);
    if (score < 0 || (assign && score > assign.points)) {
        showToast('กรอกคะแนนผิดพลาด คะแนนห้ามเกินคะแนนเต็ม!', 'error');
        return;
    }

    sub.grade = score;
    sub.feedback = feedback || 'ตรวจเรียบร้อยผ่านการประเมิน';
    sub.status = 'graded';

    saveToStorage();
    closeModal('modalGradeSubmission');
    
    renderApp();
    showToast(`ประเมินงานของ ${sub.studentName} คะแนนรวม: ${score} คะแนนสำเร็จ!`, 'success');
}

// I. ตรวจงานส่งผ่านหน้ารายวิชา (สำหรับคุณครู)
function viewAssignmentSubmissions(assignmentId) {
    const subs = state.submissions.filter(s => s.assignmentId === assignmentId);
    const assign = state.assignments.find(a => a.id === assignmentId);
    
    if (subs.length === 0) {
        showToast('ขณะนี้ยังไม่มีนักเรียนร่วมส่งงานชิ้นนี้เข้ามา!', 'info');
        return;
    }

    // เพื่อความสะดวกในการใช้งาน จะเปลี่ยนหน้าอัตโนมัติไปหน้างานค้างตรวจที่มีความระบุเฉพาะเจาะจง
    // และกรองเฉพาะส่งงานหัวข้อนี้
    state.activeTab = 'todo';
    renderTodoView();
    showToast(`ฟิลเตอร์ตรวจงานย่อย: ${assign.title} 🔎`, 'info');
}

// 9. HELPER UTILITIES

// จัดรูปแบบวันเวลาให้น่าอ่านภาษาไทย
function formatDate(isoString) {
    if (!isoString) return '-';
    const d = new Date(isoString);
    
    const months = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear() + 543; // ปี พ.ศ.
    
    let hours = d.getHours().toString().padStart(2, '0');
    let minutes = d.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
}

// คัดลอก Class Code ไปยัง Clipboard
function copyClassCode() {
    const code = document.getElementById('classDetailCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showToast(`คัดลอกรหัสเข้าห้องเรียน: ${code} สำเร็จ!`, 'success');
    }).catch(err => {
        showToast('ล้มเหลวในการคัดลอกรหัสผ่าน!', 'error');
    });
}

// สร้าสไลเดอร์แจ้งเตือนแบบ Toast
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let emoji = '🔔';
    if (type === 'success') emoji = '✔️';
    if (type === 'error') emoji = '❌';
    if (type === 'info') emoji = '🚀';

    toast.innerHTML = `
        <span>${emoji}</span>
        <span style="font-size:0.9rem; font-weight:500;">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // ลบการแจ้งเตือนหลังจากผ่านไป 4 วินาที
    setTimeout(() => {
        toast.style.animation = 'toast-out 0.3s forwards';
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
}

// เพิ่ม Animation พิเศษสำหรับเอาท์การแจ้งเตือน
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes toast-out {
        to {
            transform: translateY(-20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// 10. SYSTEM INITIAL START
document.addEventListener('DOMContentLoaded', () => {
    // โหลดข้อมูลดิบ
    loadFromStorage();
    
    // ตั้งค่าตาม Role เริ่มต้นคือ ครู
    document.body.className = 'role-teacher';
    updateUserProfile();
    
    // รันเรนเดอร์หน้าจอเริ่มต้น
    renderApp();
});
