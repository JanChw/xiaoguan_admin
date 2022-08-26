
export interface Banner {
    id?: number,
    name: string,
    title: string,
    desc: string,
    links: any,
    imgs: number[],
    updatedAt?: Date | string
  }

export const initBanner = () => ({
  name: '',
  title: '',
  desc: '',
  links: {},
  imgs: []
})
  