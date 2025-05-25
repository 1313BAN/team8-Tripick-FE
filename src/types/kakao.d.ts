export {}

declare global {
  interface Window {
    kakao: typeof kakao
  }

  namespace kakao {
    namespace maps {
      function load(callback: () => void): void
      class Map {
        constructor(container: HTMLElement, options: any)
        setCenter(latlng: LatLng): void
        setLevel(level: number): void
        getLevel(): number
        getBounds(): LatLngBounds
        setBounds(bounds: LatLngBounds): void
        // ... 필요한 메서드만 선언 추가
      }

      class LatLng {
        constructor(lat: number, lng: number)
        getLat(): number
        getLng(): number
      }

      class LatLngBounds {
        extend(latlng: LatLng): void
        getSouthWest(): LatLng
        getNorthEast(): LatLng
      }

      class Marker {
        constructor(options: any)
        setMap(map: Map | null): void
        getPosition(): LatLng
        getTitle(): string
      }

      class MarkerImage {
        constructor(src: string, size: Size)
      }

      class Size {
        constructor(width: number, height: number)
      }

      class InfoWindow {
        constructor(options: { content: string })
        open(map: Map, marker: Marker): void
        close(): void
      }

      const event: {
        addListener: (target: any, type: string, handler: Function) => void
      }
    }
  }
}
