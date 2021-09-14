export type WardFieldValue = { isEqual: (other: WardFieldValue) => boolean };
export type WardTimestamp = {seconds: number, nanoseconds: number, toDate: ()=>Date, isEqual: (other: WardTimestamp)=>boolean, toMillis: ()=>number, valueOf: ()=>string};
export function isTimestamp(v: any): v is WardTimestamp { return !!v && (typeof v=='object') && !!v.toDate && !!v.toMillis && (typeof v.nanoseconds=='number') && (typeof v.seconds=='number')};
export type WardGeoPoint = { latitude: number, longitude: number, isEqual: (other: WardGeoPoint)=>boolean }
export function isGeoPoint(v: any): v is WardGeoPoint {  return !!v && (typeof v=='object') && (typeof v.isEqual=='function')  && (typeof v.latitude=='number') && (typeof v.longitude=='number') };


export type Timestamp = null|Date|WardTimestamp|WardFieldValue
export type User = {
  createdAt: Timestamp
  updatedAt: Timestamp
  name: string
  username: string
  presence: "online" | "offline"
  lastOnlineAt: Timestamp
  avatar?: {
    URL?: string
  }
  chatLinks?: {
    zoom?: string
    googleMeet?: string
  }
  socialLinks?: {
    linkedIn?: string
    twitter?: string
    instagram?: string
    other?: string[]
  }
  welcomeMessage?: string
}
export type TextChat = {
  id: string
  uid: string
  message: string
  leftAsMessage?: boolean
}
export type Chat = {
  createdAt: Timestamp
  updatedAt: Timestamp
  callerName: string
  startedChatAt: Timestamp
  textChat?: TextChat[]
  peerConnection?: {
    offer?: any
    answer?: any
  }
}
