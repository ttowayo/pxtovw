// Supabase 설정
// 실제 프로젝트 URL과 API 키로 교체하세요
const SUPABASE_CONFIG = {
  url: "https://vahiwfiwpsxhwyrtxgrw.supabase.co", // 예: https://your-project.supabase.co
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaGl3Zml3cHN4aHd5cnR4Z3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMDEyMjYsImV4cCI6MjA2Nzg3NzIyNn0.R3M7rb7fn1_d__REv_rg5TX1tadSlqvDHhsqrKh9RUc", // 예: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
};

// 설정을 전역으로 노출
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
