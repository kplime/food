import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'ko' | 'en'

const STORAGE_KEY = 'obang-lang'

type DictShape = {
  brand: string
  nav_recipes: string
  nav_restaurants: string
  nav_community: string
  footer_tagline: string
  home_title: string
  home_subtitle: string
  home_cta: string
  feature1_title: string
  feature1_desc: string
  feature2_title: string
  feature2_desc: string
  feature3_title: string
  feature3_desc: string
  home_popular: string
  view_all: string
  recipes_title: string
  recipes_subtitle: string
  filter_all: string
  filter_vegetarian: string
  filter_vegan: string
  filter_wellness: string
  filter_spicy: string
  filter_quick: string
  tag_vegetarian: string
  tag_vegan: string
  tag_wellness: string
  tag_spicy: string
  tag_quick: string
  back_to_list: string
  minutes_servings: (minutes: number, servings: number) => string
  ingredients_title: string
  local_sub_badge: string
  steps_title: string
  chef_tip_title: string
  recipe_not_found: string
  back_to_recipes: string
  notfound_title: string
  notfound_desc: string
  back_home: string
  restaurants_title: string
  restaurants_subtitle: string
  restaurants_source: string
  home_restaurants: string
  filter_region_all: string
  address_label: string
  phone_label: string
  rating_reviews: (rating: number, reviews: number) => string
  no_info: string
  restaurants_search_title: string
  restaurants_search_subtitle: string
  search_placeholder: string
  search_results_count: (count: number) => string
  search_no_results: string
  search_too_many: (shown: number, total: number) => string
  osm_source: string
  community_board_title: string
  community_board_subtitle: string
  community_local_notice: string
  community_login_to_post: string
  community_new_post: string
  community_attach_media: string
  community_post_title_placeholder: string
  community_post_body_placeholder: string
  community_post_submit: string
  community_post_cancel: string
  community_no_posts: string
  community_comments_title: string
  community_comment_placeholder: string
  community_comment_submit: string
  community_no_comments: string
  community_back_to_board: string
  community_post_not_found: string
  community_chat_placeholder: string
  community_chat_send: string
  community_chat_no_messages: string
  community_post_chat_title: string
  auth_login_title: string
  auth_register_title: string
  auth_username_placeholder: string
  auth_password_placeholder: string
  auth_login_submit: string
  auth_register_submit: string
  auth_login_error: string
  auth_register_error: string
  auth_no_account: string
  auth_go_register: string
  auth_have_account: string
  auth_go_login: string
  auth_greeting: (username: string) => string
  auth_logout: string
}

const dict: Record<Lang, DictShape> = {
  ko: {
    brand: '오방',
    nav_recipes: '레시피',
    nav_restaurants: '한식당',
    nav_community: '커뮤니티',
    footer_tagline: '오직 한식만. 어디서든 만들 수 있게.',
    home_title: '오직 한식, 우리 동네 재료로',
    home_subtitle:
      'K-드라마와 K-팝에서 본 그 맛을, 지금 사는 곳의 마트에서 구할 수 있는 재료로. 셰프의 기본기로 배우는 건강한 한식 레시피.',
    home_cta: '레시피 둘러보기',
    feature1_title: '현지 재료 매칭',
    feature1_desc: '구하기 힘든 재료는 근처 마트에서 살 수 있는 대체재를 제안해요.',
    feature2_title: '셰프의 기본기',
    feature2_desc: '유명 셰프들이 쓰는 손질·간·불 조절 팁을 레시피마다 담았어요.',
    feature3_title: '웰빙 & 채식',
    feature3_desc: '건강과 채식을 중시하는 입맛에 맞춘 레시피를 우선 소개해요.',
    home_popular: '인기 레시피',
    view_all: '전체 보기 →',
    recipes_title: '레시피',
    recipes_subtitle: '오직 한식만. 현지 재료로 만드는 법까지.',
    filter_all: '전체',
    filter_vegetarian: '채식',
    filter_vegan: '비건',
    filter_wellness: '웰빙',
    filter_spicy: '매콤',
    filter_quick: '초스피드',
    tag_vegetarian: '채식',
    tag_vegan: '비건',
    tag_wellness: '웰빙',
    tag_spicy: '매콤',
    tag_quick: '초스피드',
    back_to_list: '← 목록으로',
    minutes_servings: (minutes: number, servings: number) => `${minutes}분 · ${servings}인분`,
    ingredients_title: '재료',
    local_sub_badge: '현지 대체',
    steps_title: '만드는 법',
    chef_tip_title: '셰프 팁',
    recipe_not_found: '레시피를 찾을 수 없어요.',
    back_to_recipes: '레시피 목록으로 돌아가기',
    notfound_title: '페이지를 찾을 수 없어요',
    notfound_desc: '주소가 잘못됐거나 삭제된 페이지예요.',
    back_home: '홈으로 돌아가기',
    restaurants_title: '미국 한식당',
    restaurants_subtitle: '지역별로 모은 미국 내 한식당 정보예요.',
    restaurants_source: '출처: mijubuy.com (KimchiPlaces.com), 비행기 시간표 블로그, Google Places',
    home_restaurants: '인기 한식당',
    filter_region_all: '전체 지역',
    address_label: '주소',
    phone_label: '전화',
    rating_reviews: (rating: number, reviews: number) => `⭐ ${rating} · 리뷰 ${reviews.toLocaleString()}개`,
    no_info: '정보 없음',
    restaurants_search_title: '미국 전역 한식당 검색',
    restaurants_search_subtitle: '이름이나 도시로 검색해서 미국 전역 한식당을 찾아보세요.',
    search_placeholder: '식당 이름, 도시, 또는 메뉴 (예: LA 칼국수)',
    search_results_count: (count: number) => `${count.toLocaleString()}곳 검색됨`,
    search_no_results: '검색 결과가 없어요.',
    search_too_many: (shown: number, total: number) =>
      `${total.toLocaleString()}곳 중 ${shown}곳만 표시 중이에요. 검색어를 좁혀보세요.`,
    osm_source: '출처: OpenStreetMap 기여자 (ODbL 라이선스)',
    community_board_title: '게시판',
    community_board_subtitle: '한식 이야기, 자유롭게 나눠요.',
    community_local_notice: '게시글·댓글·채팅이 서버(MySQL)에 저장돼서 누구나 함께 볼 수 있어요.',
    community_login_to_post: '로그인하고 글쓰기',
    community_new_post: '글쓰기',
    community_attach_media: '사진/동영상 첨부',
    community_post_title_placeholder: '제목',
    community_post_body_placeholder: '내용을 입력하세요',
    community_post_submit: '등록',
    community_post_cancel: '취소',
    community_no_posts: '아직 게시글이 없어요. 첫 글을 남겨보세요!',
    community_comments_title: '댓글',
    community_comment_placeholder: '댓글을 입력하세요',
    community_comment_submit: '등록',
    community_no_comments: '아직 댓글이 없어요.',
    community_back_to_board: '← 게시판으로',
    community_post_not_found: '게시글을 찾을 수 없어요.',
    community_chat_placeholder: '메시지를 입력하세요',
    community_chat_send: '전송',
    community_chat_no_messages: '아직 대화가 없어요. 먼저 인사해보세요!',
    community_post_chat_title: '이 글 채팅방',
    auth_login_title: '로그인',
    auth_register_title: '회원가입',
    auth_username_placeholder: '아이디',
    auth_password_placeholder: '비밀번호',
    auth_login_submit: '로그인',
    auth_register_submit: '가입하기',
    auth_login_error: '아이디 또는 비밀번호가 올바르지 않아요.',
    auth_register_error: '회원가입에 실패했어요. 다른 아이디를 입력해보세요.',
    auth_no_account: '계정이 없으신가요?',
    auth_go_register: '회원가입',
    auth_have_account: '이미 계정이 있으신가요?',
    auth_go_login: '로그인',
    auth_greeting: (username: string) => `${username}님`,
    auth_logout: '로그아웃',
  },
  en: {
    brand: 'Obang',
    nav_recipes: 'Recipes',
    nav_restaurants: 'Restaurants',
    nav_community: 'Community',
    footer_tagline: 'Korean food only. Made anywhere.',
    home_title: 'Korean Food, Made With What’s Nearby',
    home_subtitle:
      'The flavors you know from K-dramas and K-pop, made with ingredients from your local grocery store. Healthy Korean recipes built on real chef fundamentals.',
    home_cta: 'Browse Recipes',
    feature1_title: 'Local Ingredient Matching',
    feature1_desc: 'For hard-to-find ingredients, we suggest substitutes available at nearby stores.',
    feature2_title: 'Chef Fundamentals',
    feature2_desc: 'Every recipe includes prep, seasoning, and heat-control tips used by professional chefs.',
    feature3_title: 'Wellness & Vegetarian',
    feature3_desc: 'We highlight recipes suited to health-conscious and vegetarian diets.',
    home_popular: 'Popular Recipes',
    view_all: 'View all →',
    recipes_title: 'Recipes',
    recipes_subtitle: 'Korean food only — with local ingredient substitutes for every recipe.',
    filter_all: 'All',
    filter_vegetarian: 'Vegetarian',
    filter_vegan: 'Vegan',
    filter_wellness: 'Wellness',
    filter_spicy: 'Spicy',
    filter_quick: 'Quick',
    tag_vegetarian: 'Vegetarian',
    tag_vegan: 'Vegan',
    tag_wellness: 'Wellness',
    tag_spicy: 'Spicy',
    tag_quick: 'Quick',
    back_to_list: '← Back to list',
    minutes_servings: (minutes: number, servings: number) => `${minutes} min · Serves ${servings}`,
    ingredients_title: 'Ingredients',
    local_sub_badge: 'Local sub',
    steps_title: 'Instructions',
    chef_tip_title: "Chef's Tip",
    recipe_not_found: 'Recipe not found.',
    back_to_recipes: 'Back to recipe list',
    notfound_title: 'Page not found',
    notfound_desc: 'This address is invalid or the page has been removed.',
    back_home: 'Back to home',
    restaurants_title: 'Korean Restaurants in the US',
    restaurants_subtitle: 'Korean restaurants across the US, organized by region.',
    restaurants_source: 'Sources: mijubuy.com (KimchiPlaces.com), Timetable4air blog, Google Places',
    home_restaurants: 'Popular Restaurants',
    filter_region_all: 'All regions',
    address_label: 'Address',
    phone_label: 'Phone',
    rating_reviews: (rating: number, reviews: number) => `⭐ ${rating} · ${reviews.toLocaleString()} reviews`,
    no_info: 'No info available',
    restaurants_search_title: 'Search Korean Restaurants Nationwide',
    restaurants_search_subtitle: 'Search by name or city to find Korean restaurants across the US.',
    search_placeholder: 'Name, city, or dish (e.g. LA kalguksu)',
    search_results_count: (count: number) => `${count.toLocaleString()} results`,
    search_no_results: 'No results found.',
    search_too_many: (shown: number, total: number) =>
      `Showing ${shown} of ${total.toLocaleString()} results. Try narrowing your search.`,
    osm_source: 'Source: OpenStreetMap contributors (ODbL license)',
    community_board_title: 'Board',
    community_board_subtitle: 'Talk about Korean food, freely.',
    community_local_notice: 'Posts, comments, and chat are stored on the server (MySQL), visible to everyone.',
    community_login_to_post: 'Log in to post',
    community_new_post: 'New Post',
    community_attach_media: 'Attach photo/video',
    community_post_title_placeholder: 'Title',
    community_post_body_placeholder: "What's on your mind?",
    community_post_submit: 'Post',
    community_post_cancel: 'Cancel',
    community_no_posts: 'No posts yet. Be the first to write one!',
    community_comments_title: 'Comments',
    community_comment_placeholder: 'Write a comment',
    community_comment_submit: 'Post',
    community_no_comments: 'No comments yet.',
    community_back_to_board: '← Back to board',
    community_post_not_found: 'Post not found.',
    community_chat_placeholder: 'Type a message',
    community_chat_send: 'Send',
    community_chat_no_messages: 'No messages yet. Say hi first!',
    community_post_chat_title: 'Post Chat Room',
    auth_login_title: 'Log In',
    auth_register_title: 'Sign Up',
    auth_username_placeholder: 'Username',
    auth_password_placeholder: 'Password',
    auth_login_submit: 'Log In',
    auth_register_submit: 'Sign Up',
    auth_login_error: 'Incorrect username or password.',
    auth_register_error: 'Registration failed. Try a different username.',
    auth_no_account: "Don't have an account?",
    auth_go_register: 'Sign up',
    auth_have_account: 'Already have an account?',
    auth_go_login: 'Log in',
    auth_greeting: (username: string) => `Hi, ${username}`,
    auth_logout: 'Log Out',
  },
}

type DictKey = keyof DictShape

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: <K extends DictKey>(key: K) => DictShape[K]
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'ko'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'en' ? 'en' : 'ko'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: (key) => dict[lang][key],
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
