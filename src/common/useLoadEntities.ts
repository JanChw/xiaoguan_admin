import { ref } from 'vue'
import Http, { FetchOption } from '../api/http'

export interface HttpArgs {
    url: string,
    opts?: FetchOption
}

export const useLoadData = () => {
  const data = ref<any[]>([])
  const selected = ref<number[]>([])
  const search = ref<string>('')

  const loadEntities = async(load: HttpArgs) => {
    const { entities } = await Http.get(load.url, load.opts)
    data.value = entities
  }

  const handleSelectionChange = (val: any[]) => {
    selected.value = val.map(entity => entity.id)
  }

  const handleSearch = async(_search: HttpArgs) => {
    const { entities } = await Http.get(_search.url, _search.opts)
    data.value = entities
  }

  const handleDelete = async(del: HttpArgs, load: HttpArgs) => {

    const [, isCancled] = await Http.deleteWithMessageBox(del.url, del.opts)
    !isCancled && loadEntities(load)
  }

  const handleDeletes = async(url: string, load: HttpArgs) => {
    const [, isCancled] = await Http.deleteWithMessageBox(url, { data: { ids: selected.value } })
    !isCancled && loadEntities(load)
  }

  const handleSoftDelete = async(del: HttpArgs, load: HttpArgs) => {
    await Http.put(del.url, del.opts)
    loadEntities(load)
  }

  const handleSoftDeletes = async(updates: HttpArgs, load: HttpArgs) => {
    await Http.put(updates.url, updates.opts)
    loadEntities(load)
  }

  const handleRecover = async(updates: HttpArgs, load: HttpArgs) => {
    await Http.put(updates.url, updates.opts)
    loadEntities(load)
  }

  return {
    data,
    selected,
    search,
    handleSelectionChange,
    handleSearch,
    handleDelete,
    handleDeletes,
    loadEntities,
    handleSoftDelete,
    handleSoftDeletes,
    handleRecover
  }
  
}
