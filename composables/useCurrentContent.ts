export default function () {
  const { path } = useRoute()
  const { data, error } = useAsyncData(`content-${path}`, () => queryContent(path).findOne(), {
    deep: false,
  })

  watchEffect(() => {
    if (error.value) throw error.value
  })

  return data
}
