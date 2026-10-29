import { ErrorDefinition, TopicLesson, ClassRoom, StudentRecord, Question, Assignment, StudentSubmission, ImpactEvidenceRecord } from '../types';

export const ERROR_TAXONOMY: ErrorDefinition[] = [
  {
    code: 'E01',
    name: 'Chọn sai công thức',
    description: 'Áp dụng công thức không phù hợp với loại chuyển động hoặc điều kiện biên của hiện tượng.',
    remedy: 'Xem lại giả thiết đề bài (vật chuyển động đều hay biến đổi đều, dao động điều hòa hay dao động tắt dần).',
    example: 'Dùng s = v*t cho chuyển động nhanh dần đều thay vì s = v0*t + 1/2*a*t².',
  },
  {
    code: 'E02',
    name: 'Thay số sai',
    description: 'Nhầm lẫn các giá trị số của đại lượng hoặc bấm máy tính nhầm số mũ, dấu ngoặc.',
    remedy: 'Tóm tắt rõ ràng các biến số ra nháp trước khi bấm máy, kiểm tra lại thứ tự thực hiện phép tính.',
    example: 'Đề bài cho v0 = 0 nhưng học sinh bấm nhầm v0 = 2.',
  },
  {
    code: 'E03',
    name: 'Nhầm hoặc thiếu đơn vị',
    description: 'Không đổi về đơn vị chuẩn SI (km/h sang m/s, cm sang m, ms sang s, gram sang kg) hoặc quên ghi đơn vị ở đáp số.',
    remedy: 'Luôn quy đổi tất cả đại lượng về hệ SI trước khi thế số vào công thức.',
    example: 'Để vận tốc là 36 km/h thế vào công thức cùng thời gian tính bằng giây mà không đổi ra 10 m/s.',
  },
  {
    code: 'E04',
    name: 'Nhầm dấu hoặc chiều của đại lượng',
    description: 'Không chú ý dấu của đại lượng vectơ (gia tốc a, li độ x, vận tốc v) khi chiếu lên trục tọa độ.',
    remedy: 'Xác định rõ chiều dương đã chọn; chuyển động chậm dần đều thì a ngược dấu với v.',
    example: 'Chuyển động thẳng chậm dần đều theo chiều dương nhưng lại lấy gia tốc a mang dấu dương.',
  },
  {
    code: 'E05',
    name: 'Nhầm định nghĩa hoặc khái niệm',
    description: 'Hiểu sai bản chất của các thuật ngữ Vật lí (tần số với tần số góc, quãng đường với độ dịch chuyển).',
    remedy: 'Đọc kỹ định nghĩa trong sách giáo khoa GDPT 2018 và bảng so sánh các đại lượng tương đồng.',
    example: 'Nhầm tần số f (đơn vị Hz) với tần số góc omega (đơn vị rad/s).',
  },
  {
    code: 'E06',
    name: 'Sai phép biến đổi toán học',
    description: 'Chuyển vế đổi dấu sai, rút căn sai hoặc giải sai phương trình bậc hai/lượng giác.',
    remedy: 'Thực hiện từng bước biến đổi đại số cẩn thận, hạn chế gộp quá nhiều bước nhẩm.',
    example: 'Biến đổi v² - v0² = 2as thành v = v0 + căn(2as).',
  },
  {
    code: 'E07',
    name: 'Thiếu bước lập luận quan trọng',
    description: 'Bỏ qua việc chọn hệ quy chiếu, chiều dương hoặc giả thiết bỏ qua ma sát/lực cản.',
    remedy: 'Trình bày theo các bước chuẩn: Chọn HQC -> Viết công thức tổng quát -> Chiếu lên chiều dương -> Thay số.',
    example: 'Áp dụng định luật II Newton mà không vẽ hình phân tích lực và chọn trục tọa độ.',
  },
  {
    code: 'E08',
    name: 'Hiểu sai hiện tượng Vật lí',
    description: 'Suy diễn sai về nguyên nhân chuyển động hoặc tương tác lực.',
    remedy: 'Quan sát các ví dụ thực tiễn hoặc mô phỏng thí nghiệm để thấy rõ bản chất tương tác.',
    example: 'Nghĩ rằng vật nặng rơi nhanh hơn vật nhẹ trong chân không.',
  },
  {
    code: 'E09',
    name: 'Chưa đủ thông tin để kết luận',
    description: 'Đưa ra kết luận vội vàng khi bài toán còn thiếu dữ kiện biên hoặc có nhiều trường hợp.',
    remedy: 'Kiểm tra xem số phương trình độc lập đã đủ số ẩn số hay chưa.',
    example: 'Khẳng định vật dừng lại ngay khi lực triệt tiêu mà không xét quán tính.',
  },
];

export const INITIAL_CURRICULUM_LESSONS: TopicLesson[] = [
  // Grade 10
  {
    id: 'g10-cd1',
    grade: 10,
    topicCode: 'K10-C2-B01',
    title: 'Chuyển động thẳng biến đổi đều (Chuyên đề mẫu P0)',
    objective: 'Nắm vững định nghĩa, các công thức liên hệ giữa vận tốc, gia tốc, thời gian, quãng đường và áp dụng giải bài toán thực tế.',
    coreConcepts: [
      'Gia tốc là đại lượng đặc trưng cho sự biến thiên nhanh hay chậm của vận tốc theo thời gian: a = (v - v0) / t.',
      'Chuyển động thẳng nhanh dần đều: a và v cùng dấu (a.v > 0).',
      'Chuyển động thẳng chậm dần đều: a và v trái dấu (a.v < 0).',
    ],
    keyFormulas: [
      {
        name: 'Công thức vận tốc',
        latex: 'v = v0 + at',
        explanation: 'Tính vận tốc tức thời tại thời điểm t',
        units: 'v, v0: m/s; a: m/s²; t: s',
      },
      {
        name: 'Công thức quãng đường',
        latex: 's = v0*t + (1/2)*a*t²',
        explanation: 'Tính quãng đường đi được sau khoảng thời gian t',
        units: 's: m; v0: m/s; t: s; a: m/s²',
      },
      {
        name: 'Hệ thức độc lập thời gian',
        latex: 'v² - v0² = 2*a*s',
        explanation: 'Liên hệ giữa vận tốc, gia tốc và quãng đường khi không biết thời gian',
        units: 'v, v0: m/s; a: m/s²; s: m',
      },
    ],
    commonErrors: [
      { code: 'E01', description: 'Dùng công thức s = v*t của chuyển động thẳng đều' },
      { code: 'E04', description: 'Quên dấu âm của gia tốc trong chuyển động chậm dần đều' },
      { code: 'E03', description: 'Không đổi vận tốc km/h sang m/s (chia cho 3,6)' },
    ],
    workedExample: {
      problem: 'Một vật bắt đầu chuyển động từ trạng thái nghỉ với gia tốc a = 2 m/s². Sau 5 giây, hãy tính vận tốc và quãng đường vật đi được.',
      solution: 'Dữ kiện: v0 = 0 (trạng thái nghỉ); a = 2 m/s²; t = 5 s.\n- Vận tốc: v = v0 + at = 0 + 2 * 5 = 10 m/s.\n- Quãng đường: s = v0*t + 1/2*a*t² = 0*5 + 1/2 * 2 * (5)² = 25 m.',
    },
  },
  {
    id: 'g10-cd2',
    grade: 10,
    topicCode: 'K10-C1-B01',
    title: 'Đo lường và sai số trong Vật lí',
    objective: 'Biết cách xác định sai số dụng cụ, sai số ngẫu nhiên và viết kết quả đo đúng quy cách.',
    coreConcepts: [
      'Phép đo trực tiếp và gián tiếp.',
      'Sai số tuyệt đối và sai số tương đối.',
      'Quy tắc làm tròn chữ số có nghĩa.',
    ],
    keyFormulas: [
      {
        name: 'Kết quả đo',
        latex: 'A = A_tb ± ΔA',
        explanation: 'Biểu diễn giá trị trung bình kèm sai số tuyệt đối',
        units: 'Đơn vị của đại lượng A',
      },
      {
        name: 'Sai số tương đối',
        latex: 'δA = (ΔA / A_tb) * 100%',
        explanation: 'Mức độ chính xác của phép đo',
        units: '%',
      },
    ],
    commonErrors: [
      { code: 'E03', description: 'Quên ghi đơn vị của sai số tuyệt đối' },
      { code: 'E06', description: 'Tính sai giá trị trung bình cộng' },
    ],
    workedExample: {
      problem: 'Đo 5 lần thời gian rơi của một vật được kết quả: 0,40s; 0,41s; 0,39s; 0,42s; 0,40s. Tính thời gian trung bình.',
      solution: 't_tb = (0,40 + 0,41 + 0,39 + 0,42 + 0,40) / 5 = 0,404 s ≈ 0,40 s.',
    },
  },
  {
    id: 'g10-cd3',
    grade: 10,
    topicCode: 'K10-C3-B01',
    title: 'Ba định luật Newton về chuyển động',
    objective: 'Phát biểu đúng các định luật Newton và viết được phương trình động lực học.',
    coreConcepts: [
      'Định luật 1: Quán tính của vật khi không có hợp lực tác dụng.',
      'Định luật 2: Gia tốc tỉ lệ thuận với hợp lực và tỉ lệ nghịch với khối lượng: F = m*a.',
      'Định luật 3: Tác dụng và phản tác dụng luôn là hai lực trực đối.',
    ],
    keyFormulas: [
      {
        name: 'Định luật II Newton',
        latex: 'vecto(F) = m * vecto(a)',
        explanation: 'Phương trình cơ bản của động lực học chất điểm',
        units: 'F: N (Newton); m: kg; a: m/s²',
      },
    ],
    commonErrors: [
      { code: 'E07', description: 'Không tổng hợp các lực tác dụng trước khi viết F = ma' },
      { code: 'E03', description: 'Để khối lượng gram thế vào công thức mà không đổi ra kg' },
    ],
    workedExample: {
      problem: 'Tác dụng lực F = 10 N lên vật có khối lượng m = 2 kg đang đứng yên. Tính gia tốc của vật.',
      solution: 'Áp dụng định luật II Newton: a = F / m = 10 / 2 = 5 m/s².',
    },
  },
  {
    id: 'g10-cd4',
    grade: 10,
    topicCode: 'K10-C4-B01',
    title: 'Công và Năng lượng',
    objective: 'Vận dụng định lý động năng và định luật bảo toàn cơ năng.',
    coreConcepts: [
      'Công cơ học: A = F*s*cos(alpha).',
      'Động năng Wd = 1/2*m*v².',
      'Thế năng trọng trường Wt = m*g*z.',
    ],
    keyFormulas: [
      {
        name: 'Công cơ học',
        latex: 'A = F * s * cos(α)',
        explanation: 'Công của lực không đổi dịch chuyển quãng đường s',
        units: 'A: J (Joule); F: N; s: m; α: độ',
      },
      {
        name: 'Bảo toàn cơ năng',
        latex: 'W = Wd + Wt = const',
        explanation: 'Cơ năng được bảo toàn khi vật chỉ chịu tác dụng của lực thế',
        units: 'J',
      },
    ],
    commonErrors: [
      { code: 'E04', description: 'Xác định sai góc alpha dẫn đến sai dấu công phát động/công cản' },
    ],
    workedExample: {
      problem: 'Kéo một vật đi được 10 m bằng lực F = 50 N song song với hướng dịch chuyển. Tính công sinh ra.',
      solution: 'Góc α = 0° => cos(0°) = 1. Công A = F * s * cos(0°) = 50 * 10 * 1 = 500 J.',
    },
  },

  // Grade 11
  {
    id: 'g11-cd1',
    grade: 11,
    topicCode: 'K11-C1-B01',
    title: 'Dao động điều hòa (Chuyên đề mẫu P0)',
    objective: 'Hiểu bản chất dao động điều hòa, mối liên hệ giữa chu kì, tần số, tần số góc và phương trình li độ, vận tốc, gia tốc.',
    coreConcepts: [
      'Dao động điều hòa là dao động mà li độ của vật là một hàm côsin (hoặc sin) của thời gian.',
      'Chu kì T là khoảng thời gian để vật thực hiện một dao động toàn phần.',
      'Tần số f là số dao động toàn phần thực hiện được trong một giây.',
      'Tần số góc omega liên hệ chặt chẽ với chu kì và tần số.',
    ],
    keyFormulas: [
      {
        name: 'Phương trình dao động',
        latex: 'x = A*cos(ωt + φ)',
        explanation: 'Li độ của vật tại thời điểm t',
        units: 'x, A: cm hoặc m; ω: rad/s; φ: rad',
      },
      {
        name: 'Liên hệ chu kì và tần số',
        latex: 'T = 1/f = 2π / ω',
        explanation: 'Chu kì dao động',
        units: 'T: s; f: Hz; ω: rad/s',
      },
      {
        name: 'Tần số góc',
        latex: 'ω = 2π*f = 2π / T',
        explanation: 'Tần số góc của dao động',
        units: 'ω: rad/s; f: Hz; T: s',
      },
    ],
    commonErrors: [
      { code: 'E05', description: 'Nhầm lẫn giữa tần số f (Hz) và tần số góc omega (rad/s)' },
      { code: 'E06', description: 'Nghịch đảo sai: T = 1/f bị tính nhầm thành T = f' },
      { code: 'E03', description: 'Nhầm lẫn đơn vị giữa cm và m trong biên độ' },
    ],
    workedExample: {
      problem: 'Một vật dao động điều hòa với tần số f = 2 Hz. Tính chu kì T và tần số góc ω của dao động.',
      solution: 'Dữ kiện: f = 2 Hz.\n- Chu kì: T = 1 / f = 1 / 2 = 0,5 s.\n- Tần số góc: ω = 2 * π * f = 2 * π * 2 = 4π rad/s (xấp xỉ 12,57 rad/s).',
    },
  },
  {
    id: 'g11-cd2',
    grade: 11,
    topicCode: 'K11-C2-B01',
    title: 'Sóng cơ và sự truyền sóng',
    objective: 'Phân biệt sóng dọc, sóng ngang; vận dụng công thức bước sóng và phương trình truyền sóng.',
    coreConcepts: [
      'Sóng cơ là sự lan truyền dao động cơ trong môi trường vật chất.',
      'Bước sóng lambda là quãng đường sóng truyền đi được trong một chu kì.',
    ],
    keyFormulas: [
      {
        name: 'Công thức bước sóng',
        latex: 'λ = v * T = v / f',
        explanation: 'Liên hệ giữa bước sóng, tốc độ truyền sóng và tần số',
        units: 'λ: m; v: m/s; T: s; f: Hz',
      },
    ],
    commonErrors: [
      { code: 'E01', description: 'Nhầm lẫn giữa tốc độ truyền sóng v và vận tốc dao động của phần tử môi trường' },
    ],
    workedExample: {
      problem: 'Một sóng có tần số f = 50 Hz truyền với tốc độ v = 200 m/s. Bước sóng của sóng này là bao nhiêu?',
      solution: 'Áp dụng công thức: λ = v / f = 200 / 50 = 4 m.',
    },
  },
  {
    id: 'g11-cd3',
    grade: 11,
    topicCode: 'K11-C3-B01',
    title: 'Điện trường và Cường độ điện trường',
    objective: 'Xác định lực điện tác dụng lên điện tích và cường độ điện trường do điện tích điểm gây ra.',
    coreConcepts: [
      'Điện trường là môi trường vật chất bao quanh điện tích và tác dụng lực điện lên điện tích khác đặt trong nó.',
      'Cường độ điện trường E = F / q.',
    ],
    keyFormulas: [
      {
        name: 'Định luật Coulomb',
        latex: 'F = k * |q1*q2| / (ε * r²)',
        explanation: 'Lực tương tác tĩnh điện giữa hai điện tích điểm',
        units: 'F: N; k = 9.10^9 N.m²/C²; q: C; r: m',
      },
      {
        name: 'Cường độ điện trường điện tích điểm',
        latex: 'E = k * |Q| / (ε * r²)',
        explanation: 'Đặc trưng cho độ mạnh yếu của điện trường',
        units: 'E: V/m (hoặc N/C)',
      },
    ],
    commonErrors: [
      { code: 'E03', description: 'Quên đổi khoảng cách r từ cm sang m trước khi bình phương' },
      { code: 'E06', description: 'Quên bình phương khoảng cách r trong mẫu số' },
    ],
    workedExample: {
      problem: 'Hai điện tích điểm q1 = 2.10^-8 C, q2 = -2.10^-8 C đặt cách nhau 10 cm trong chân không. Tính lực tương tác.',
      solution: 'r = 10 cm = 0,1 m. Lực F = 9.10^9 * |2.10^-8 * (-2.10^-8)| / (0,1)² = 3,6.10^-4 N.',
    },
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  // Grade 10 - Topic 1: Rectilinear Accelerated Motion (Sample P0)
  {
    id: 'q-10-01',
    topicId: 'g10-cd1',
    grade: 10,
    text: 'Một vật bắt đầu chuyển động từ trạng thái nghỉ với gia tốc a = 2 m/s². Tính vận tốc của vật sau 5 giây.',
    type: 'numeric_fill',
    correctAnswer: '10',
    numericAnswer: 10,
    tolerance: 0.1,
    unit: 'm/s',
    targetFormula: 'v = v0 + at',
    solutionSteps: [
      'Xác định dữ kiện: Vật bắt đầu từ trạng thái nghỉ nên v0 = 0 m/s.',
      'Gia tốc a = 2 m/s², thời gian t = 5 s.',
      'Áp dụng công thức vận tốc: v = v0 + at = 0 + 2 * 5 = 10 m/s.',
    ],
    cognitiveLevel: 'Thông hiểu',
    difficultyTier: 'foundation',
    objective: 'Vận dụng công thức vận tốc của chuyển động thẳng biến đổi đều',
    associatedError: 'E01',
    isVerified: true,
    status: 'approved',
  },
  {
    id: 'q-10-02',
    topicId: 'g10-cd1',
    grade: 10,
    text: 'Một vật bắt đầu chuyển động từ trạng thái nghỉ với gia tốc a = 2 m/s². Tính quãng đường vật đi được sau 5 giây.',
    type: 'numeric_fill',
    correctAnswer: '25',
    numericAnswer: 25,
    tolerance: 0.1,
    unit: 'm',
    targetFormula: 's = v0*t + 0.5*a*t^2',
    solutionSteps: [
      'Xác định dữ kiện: v0 = 0 m/s; a = 2 m/s²; t = 5 s.',
      'Áp dụng công thức quãng đường: s = v0*t + 1/2*a*t².',
      'Thay số: s = 0*5 + 0,5 * 2 * 5² = 1 * 25 = 25 m.',
    ],
    cognitiveLevel: 'Vận dụng',
    difficultyTier: 'application',
    objective: 'Tính toán quãng đường trong chuyển động biến đổi đều',
    associatedError: 'E01',
    isVerified: true,
    status: 'approved',
  },
  {
    id: 'q-10-03',
    topicId: 'g10-cd1',
    grade: 10,
    text: 'Một ô tô đang chạy với vận tốc 54 km/h thì hãm phanh chuyển động chậm dần đều và dừng hẳn sau 10 giây. Gia tốc của xe là bao nhiêu?',
    type: 'multiple_choice',
    options: ['A. -1,5 m/s²', 'B. 1,5 m/s²', 'C. -5,4 m/s²', 'D. 5,4 m/s²'],
    correctAnswer: 'A',
    numericAnswer: -1.5,
    unit: 'm/s²',
    targetFormula: 'a = (v - v0) / t',
    solutionSteps: [
      'Đổi đơn vị: v0 = 54 km/h = 54 / 3,6 = 15 m/s.',
      'Xe dừng hẳn nên v = 0 m/s sau t = 10 s.',
      'Gia tốc: a = (v - v0) / t = (0 - 15) / 10 = -1,5 m/s² (dấu âm thể hiện chiều gia tốc ngược chiều vận tốc).',
    ],
    cognitiveLevel: 'Vận dụng',
    difficultyTier: 'application',
    objective: 'Nhận biết dấu của gia tốc trong chuyển động chậm dần đều',
    associatedError: 'E04',
    isVerified: true,
    status: 'approved',
  },
  {
    id: 'q-10-04',
    topicId: 'g10-cd1',
    grade: 10,
    text: 'Một xe máy tăng tốc từ 10 m/s lên 20 m/s trên quãng đường thẳng dài 75 m. Gia tốc của xe là:',
    type: 'multiple_choice',
    options: ['A. 2 m/s²', 'B. 4 m/s²', 'C. 1,5 m/s²', 'D. 3 m/s²'],
    correctAnswer: 'A',
    numericAnswer: 2,
    unit: 'm/s²',
    targetFormula: 'v^2 - v0^2 = 2as',
    solutionSteps: [
      'Áp dụng hệ thức độc lập thời gian: v² - v0² = 2as.',
      'Thay số: 20² - 10² = 2 * a * 75 <=> 400 - 100 = 150a <=> 300 = 150a => a = 2 m/s².',
    ],
    cognitiveLevel: 'Vận dụng cao',
    difficultyTier: 'challenge',
    objective: 'Vận dụng hệ thức độc lập thời gian để tìm gia tốc',
    associatedError: 'E06',
    isVerified: true,
    status: 'approved',
  },

  // Grade 11 - Topic 1: Harmonic Oscillation (Sample P0)
  {
    id: 'q-11-01',
    topicId: 'g11-cd1',
    grade: 11,
    text: 'Một vật dao động điều hòa với tần số f = 2 Hz. Chu kì dao động T của vật là bao nhiêu giây?',
    type: 'numeric_fill',
    correctAnswer: '0.5',
    numericAnswer: 0.5,
    tolerance: 0.05,
    unit: 's',
    targetFormula: 'T = 1 / f',
    solutionSteps: [
      'Dữ kiện: Tần số f = 2 Hz.',
      'Công thức tính chu kì theo tần số: T = 1 / f.',
      'Thay số: T = 1 / 2 = 0,5 s.',
    ],
    cognitiveLevel: 'Nhận biết',
    difficultyTier: 'foundation',
    objective: 'Vận dụng mối liên hệ giữa chu kì và tần số',
    associatedError: 'E05',
    isVerified: true,
    status: 'approved',
  },
  {
    id: 'q-11-02',
    topicId: 'g11-cd1',
    grade: 11,
    text: 'Một vật dao động điều hòa với tần số f = 2 Hz. Tần số góc ω của dao động có giá trị xấp xỉ bao nhiêu rad/s (lấy π ≈ 3,1416)?',
    type: 'numeric_fill',
    correctAnswer: '12.57',
    numericAnswer: 12.57,
    tolerance: 0.2,
    unit: 'rad/s',
    targetFormula: 'omega = 2*pi*f',
    solutionSteps: [
      'Dữ kiện: f = 2 Hz.',
      'Công thức tần số góc: ω = 2πf.',
      'Thay số: ω = 2 * 3,1416 * 2 = 4π ≈ 12,57 rad/s.',
    ],
    cognitiveLevel: 'Thông hiểu',
    difficultyTier: 'application',
    objective: 'Tính tần số góc từ tần số dao động',
    associatedError: 'E05',
    isVerified: true,
    status: 'approved',
  },
  {
    id: 'q-11-03',
    topicId: 'g11-cd1',
    grade: 11,
    text: 'Một chất điểm dao động điều hòa theo phương trình x = 6*cos(4*pi*t - pi/6) (cm). Tốc độ cực đại của chất điểm trong quá trình dao động là:',
    type: 'multiple_choice',
    options: ['A. 24π cm/s', 'B. 6 cm/s', 'C. 4π cm/s', 'D. 12π cm/s'],
    correctAnswer: 'A',
    numericAnswer: 75.4,
    unit: 'cm/s',
    targetFormula: 'v_max = omega * A',
    solutionSteps: [
      'Từ phương trình: Biên độ A = 6 cm, tần số góc ω = 4π rad/s.',
      'Tốc độ cực đại khi vật qua vị trí cân bằng: v_max = ω * A = 4π * 6 = 24π cm/s (≈ 75,4 cm/s).',
    ],
    cognitiveLevel: 'Vận dụng',
    difficultyTier: 'application',
    objective: 'Xác định vận tốc cực đại trong dao động điều hòa',
    associatedError: 'E01',
    isVerified: true,
    status: 'approved',
  },
  {
    id: 'q-11-04',
    topicId: 'g11-cd1',
    grade: 11,
    text: 'Con lắc lò xo dao động điều hòa với chu kì T = 0,4 s. Nếu tăng khối lượng của vật nặng lên 4 lần thì chu kì dao động mới là bao nhiêu?',
    type: 'multiple_choice',
    options: ['A. 0,8 s', 'B. 0,2 s', 'C. 1,6 s', 'D. 0,4 s'],
    correctAnswer: 'A',
    numericAnswer: 0.8,
    unit: 's',
    targetFormula: 'T = 2*pi*sqrt(m/k)',
    solutionSteps: [
      'Chu kì của con lắc lò xo: T = 2π*căn(m / k).',
      'Khi khối lượng m tăng 4 lần thì căn(m) tăng 2 lần.',
      'Do đó chu kì mới: T\' = 2 * T = 2 * 0,4 = 0,8 s.',
    ],
    cognitiveLevel: 'Vận dụng cao',
    difficultyTier: 'challenge',
    objective: 'Phân tích sự phụ thuộc của chu kì vào khối lượng vật',
    associatedError: 'E06',
    isVerified: true,
    status: 'approved',
  },
];

// Helper to generate full rosters of realistic Vietnamese names
function generateRoster(
  classId: string,
  grade: 10 | 11,
  count: number,
  codePrefix: string,
  startNumber: number = 1
): StudentRecord[] {
  const familyNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Huỳnh', 'Hoàng', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Đinh'];
  const middleMale = ['Văn', 'Minh', 'Hoàng', 'Gia', 'Đức', 'Bảo', 'Tuấn', 'Đình', 'Thanh', 'Quốc', 'Hữu', 'Trọng', 'Khánh', 'Hải'];
  const middleFemale = ['Thị', 'Ngọc', 'Phương', 'Mai', 'Thảo', 'Kim', 'Xuân', 'Diệu', 'Thanh', 'Bích', 'Thu', 'Ánh', 'Hồng', 'Hà'];
  const givenMale = ['An', 'Bình', 'Cường', 'Dũng', 'Đạt', 'Hải', 'Hưng', 'Huy', 'Khoa', 'Khôi', 'Long', 'Minh', 'Nam', 'Nghĩa', 'Nguyên', 'Phát', 'Phúc', 'Quân', 'Quang', 'Sang', 'Sơn', 'Tân', 'Thắng', 'Thịnh', 'Tiến', 'Toàn', 'Triết', 'Trung', 'Tuấn', 'Tùng', 'Việt', 'Vinh'];
  const givenFemale = ['Anh', 'Chi', 'Dung', 'Hằng', 'Hương', 'Huyền', 'Lan', 'Linh', 'Loan', 'Mai', 'Nga', 'Ngân', 'Nhi', 'Nhung', 'Oanh', 'Phương', 'Phượng', 'Quyên', 'Quỳnh', 'Thảo', 'Thu', 'Thủy', 'Tiên', 'Trâm', 'Trang', 'Tuyết', 'Uyên', 'Vân', 'Vy', 'Yến'];

  const errorPool: ('E01' | 'E02' | 'E03' | 'E04' | 'E05' | 'E06' | 'E07')[] = [
    'E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07'
  ];

  const students: StudentRecord[] = [];

  for (let i = 0; i < count; i++) {
    const isFemale = i % 2 === 1;
    const fam = familyNames[i % familyNames.length];
    const mid = isFemale
      ? middleFemale[(i * 3) % middleFemale.length]
      : middleMale[(i * 3) % middleMale.length];
    const given = isFemale
      ? givenFemale[(i * 5) % givenFemale.length]
      : givenMale[(i * 5) % givenMale.length];

    const fullName = `${fam} ${mid} ${given}`;
    const numStr = String(startNumber + i).padStart(3, '0');
    const code = `${codePrefix}-${numStr}`;

    // Base scores and assignment stats
    const completed = 2 + (i % 4);
    const baseScore = 6.0 + ((i * 17) % 36) / 10; // 6.0 to 9.5
    const avgScore = Math.round(baseScore * 10) / 10;
    const preScore = Math.round((Math.max(4.5, avgScore - (1.2 + (i % 3) * 0.5))) * 10) / 10;
    const postScore = avgScore;

    // Pick 0-2 recent errors
    const errs: any[] = [];
    if (i % 3 === 0) errs.push(errorPool[i % errorPool.length]);
    if (i % 5 === 0) errs.push(errorPool[(i + 2) % errorPool.length]);

    students.push({
      id: `stu-${classId}-${numStr}`,
      code,
      name: fullName,
      classId,
      grade,
      completedAssignments: completed,
      averageScore: avgScore,
      recentErrors: Array.from(new Set(errs)),
      isDemoData: true,
      preTestScore: preScore,
      postTestScore: postScore,
    });
  }

  return students;
}

// 1. Grade 10: 51 students
export const STUDENTS_10A1 = generateRoster('cls-10a1', 10, 51, 'HS10', 1);

// 2. Grade 11 (first class): 45 students
export const STUDENTS_11B1 = generateRoster('cls-11b1', 11, 45, 'HS11A', 1);

// 3. Grade 11 (second class): 38 students
export const STUDENTS_11B2 = generateRoster('cls-11b2', 11, 38, 'HS11B', 1);

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'cls-10a1',
    name: 'Lớp 10A1 (THPT số 1 Tuy Phước)',
    grade: 10,
    code: 'PHY10-TP01',
    academicYear: '2026-2027',
    teacherName: 'Phan Tố Quyên',
    studentCount: 51,
    studentIds: STUDENTS_10A1.map((s) => s.id),
    isDemoData: true,
  },
  {
    id: 'cls-11b1',
    name: 'Lớp 11B1 (THPT số 1 Tuy Phước)',
    grade: 11,
    code: 'PHY11-TP01',
    academicYear: '2026-2027',
    teacherName: 'Phan Tố Quyên',
    studentCount: 45,
    studentIds: STUDENTS_11B1.map((s) => s.id),
    isDemoData: true,
  },
  {
    id: 'cls-11b2',
    name: 'Lớp 11B2 (THPT số 1 Tuy Phước)',
    grade: 11,
    code: 'PHY11-TP02',
    academicYear: '2026-2027',
    teacherName: 'Phan Tố Quyên',
    studentCount: 38,
    studentIds: STUDENTS_11B2.map((s) => s.id),
    isDemoData: true,
  },
];

export const INITIAL_STUDENTS: StudentRecord[] = [
  ...STUDENTS_10A1,
  ...STUDENTS_11B1,
  ...STUDENTS_11B2,
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-10-01',
    classId: 'cls-10a1',
    title: 'Bài tập tuần 1: Chuyển động biến đổi đều & Vận tốc tức thời',
    topicId: 'g10-cd1',
    grade: 10,
    deadline: '2026-11-05',
    questionIds: ['q-10-01', 'q-10-02', 'q-10-03', 'q-10-04'],
    totalQuestions: 4,
    isExamMode: false,
    allowImmediateFeedback: true,
    isDemoData: true,
    createdAt: '2026-10-25',
  },
  {
    id: 'asg-11-01',
    classId: 'cls-11b1',
    title: 'Bài kiểm tra chuyên đề 1: Dao động điều hòa & Tần số góc',
    topicId: 'g11-cd1',
    grade: 11,
    deadline: '2026-11-08',
    questionIds: ['q-11-01', 'q-11-02', 'q-11-03', 'q-11-04'],
    totalQuestions: 4,
    isExamMode: true,
    allowImmediateFeedback: false,
    isDemoData: true,
    createdAt: '2026-10-26',
  },
  {
    id: 'asg-11-02',
    classId: 'cls-11b2',
    title: 'Bài luyện tập chuyên đề: Đặc trưng chu kì dao động điều hòa',
    topicId: 'g11-cd1',
    grade: 11,
    deadline: '2026-11-10',
    questionIds: ['q-11-01', 'q-11-02', 'q-11-03', 'q-11-04'],
    totalQuestions: 4,
    isExamMode: false,
    allowImmediateFeedback: true,
    isDemoData: true,
    createdAt: '2026-10-27',
  },
];

export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  // Class 10A1 submissions
  {
    id: 'sub-10-01',
    assignmentId: 'asg-10-01',
    studentId: STUDENTS_10A1[0].id,
    studentName: STUDENTS_10A1[0].name,
    submittedAt: '2026-10-26 14:30',
    score: 8.5,
    totalScore: 10,
    answers: [
      { questionId: 'q-10-01', studentAnswer: '10', isCorrect: true },
      { questionId: 'q-10-02', studentAnswer: '25', isCorrect: true },
      { questionId: 'q-10-03', studentAnswer: 'A', isCorrect: true },
      { questionId: 'q-10-04', studentAnswer: 'B', isCorrect: false, detectedError: 'E06' },
    ],
    isDemoData: true,
  },
  {
    id: 'sub-10-02',
    assignmentId: 'asg-10-01',
    studentId: STUDENTS_10A1[1].id,
    studentName: STUDENTS_10A1[1].name,
    submittedAt: '2026-10-27 09:15',
    score: 7.0,
    totalScore: 10,
    answers: [
      { questionId: 'q-10-01', studentAnswer: '10', isCorrect: true },
      { questionId: 'q-10-02', studentAnswer: '50', isCorrect: false, detectedError: 'E01' },
      { questionId: 'q-10-03', studentAnswer: 'B', isCorrect: false, detectedError: 'E04' },
      { questionId: 'q-10-04', studentAnswer: 'A', isCorrect: true },
    ],
    isDemoData: true,
  },
  {
    id: 'sub-10-03',
    assignmentId: 'asg-10-01',
    studentId: STUDENTS_10A1[2].id,
    studentName: STUDENTS_10A1[2].name,
    submittedAt: '2026-10-27 10:20',
    score: 6.5,
    totalScore: 10,
    answers: [
      { questionId: 'q-10-01', studentAnswer: '10', isCorrect: true },
      { questionId: 'q-10-02', studentAnswer: '20', isCorrect: false, detectedError: 'E02' },
      { questionId: 'q-10-03', studentAnswer: 'A', isCorrect: true },
      { questionId: 'q-10-04', studentAnswer: 'C', isCorrect: false, detectedError: 'E01' },
    ],
    isDemoData: true,
  },
  // Class 11B1 submissions
  {
    id: 'sub-11-01',
    assignmentId: 'asg-11-01',
    studentId: STUDENTS_11B1[0].id,
    studentName: STUDENTS_11B1[0].name,
    submittedAt: '2026-10-27 15:40',
    score: 9.0,
    totalScore: 10,
    answers: [
      { questionId: 'q-11-01', studentAnswer: '0.5', isCorrect: true },
      { questionId: 'q-11-02', studentAnswer: '12.57', isCorrect: true },
      { questionId: 'q-11-03', studentAnswer: 'A', isCorrect: true },
      { questionId: 'q-11-04', studentAnswer: 'A', isCorrect: true },
    ],
    isDemoData: true,
  },
  {
    id: 'sub-11-02',
    assignmentId: 'asg-11-01',
    studentId: STUDENTS_11B1[1].id,
    studentName: STUDENTS_11B1[1].name,
    submittedAt: '2026-10-27 16:10',
    score: 7.5,
    totalScore: 10,
    answers: [
      { questionId: 'q-11-01', studentAnswer: '0.5', isCorrect: true },
      { questionId: 'q-11-02', studentAnswer: '4', isCorrect: false, detectedError: 'E05' },
      { questionId: 'q-11-03', studentAnswer: 'A', isCorrect: true },
      { questionId: 'q-11-04', studentAnswer: 'B', isCorrect: false, detectedError: 'E06' },
    ],
    isDemoData: true,
  },
  // Class 11B2 submissions
  {
    id: 'sub-11-03',
    assignmentId: 'asg-11-02',
    studentId: STUDENTS_11B2[0].id,
    studentName: STUDENTS_11B2[0].name,
    submittedAt: '2026-10-28 08:30',
    score: 8.0,
    totalScore: 10,
    answers: [
      { questionId: 'q-11-01', studentAnswer: '0.5', isCorrect: true },
      { questionId: 'q-11-02', studentAnswer: '12.57', isCorrect: true },
      { questionId: 'q-11-03', studentAnswer: 'D', isCorrect: false, detectedError: 'E01' },
      { questionId: 'q-11-04', studentAnswer: 'A', isCorrect: true },
    ],
    isDemoData: true,
  },
];

export const INITIAL_IMPACT_EVIDENCE: ImpactEvidenceRecord[] = [
  {
    id: 'ev-2026-01',
    title: 'Đánh giá tác động can thiệp Socratic AI trên chuyên đề Chuyển động biến đổi đều (Lớp 10)',
    implementationPeriod: 'Tháng 09/2026 - Tháng 10/2026 (Học kỳ I, Năm học 2026-2027)',
    participantCount: 51,
    description: 'Thử nghiệm can thiệp sư phạm có đối chiếu trước và sau khi học sinh Lớp 10A1 (51 học sinh) sử dụng Gia sư Physics Mentor AI để giải quyết các lỗi sai E01 và E04. Chỉ tính điểm trên các học sinh hoàn thành cả 2 bài kiểm tra trước và sau.',
    prePostPairs: STUDENTS_10A1.slice(0, 10).map((s) => ({
      studentCode: s.code,
      studentName: s.name,
      preScore: s.preTestScore || 5.0,
      postScore: s.postTestScore || 7.5,
    })),
    teacherReflections: 'Học sinh tiến bộ rõ rệt ở khâu tóm tắt dữ kiện và nhận diện dấu của gia tốc. Số lần nhầm công thức s = vt (E01) giảm từ 68% xuống còn 12% sau 3 tuần tương tác.',
    attachmentName: 'bien_ban_khao_sat_thpt_so_1_tuy_phuoc.pdf',
    isDemoData: true,
    createdAt: '2026-10-27',
  },
  {
    id: 'ev-2026-02',
    title: 'Đánh giá tác động trên hai lớp 11 (11B1: 45 HS và 11B2: 38 HS) chuyên đề Dao động điều hòa',
    implementationPeriod: 'Tháng 10/2026 - Tháng 11/2026 (Học kỳ I, Năm học 2026-2027)',
    participantCount: 83,
    description: 'Nghiên cứu đối chứng trên 83 học sinh Khối 11 (Lớp 11B1: 45 học sinh; Lớp 11B2: 38 học sinh). Học sinh được hướng dẫn phân biệt chu kì T, tần số f và tần số góc omega thông qua giàn giáo 3 tầng gợi ý của Physics Mentor AI.',
    prePostPairs: [
      ...STUDENTS_11B1.slice(0, 5).map((s) => ({
        studentCode: s.code,
        studentName: s.name,
        preScore: s.preTestScore || 5.5,
        postScore: s.postTestScore || 8.0,
      })),
      ...STUDENTS_11B2.slice(0, 5).map((s) => ({
        studentCode: s.code,
        studentName: s.name,
        preScore: s.preTestScore || 5.0,
        postScore: s.postTestScore || 7.5,
      })),
    ],
    teacherReflections: 'Học sinh khối 11 nắm chắc bản chất mối liên hệ giữa các đại lượng dao động điều hòa. Tỷ lệ nhầm lẫn đơn vị giữa Hz và rad/s (E05) giảm đáng kể.',
    attachmentName: 'bao_cao_khao_sat_khoi_11_tuy_phuoc.pdf',
    isDemoData: true,
    createdAt: '2026-10-28',
  },
];
