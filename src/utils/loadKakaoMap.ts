export async function loadKakaoMap(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      // 이미 로드된 경우
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&autoload=false`
    script.async = true
    script.onload = () => {
      // 이 안에서 kakao.maps.load로 래핑
      window.kakao.maps.load(() => {
        resolve()
      })
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}
