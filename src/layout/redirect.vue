<script lang="ts" setup name="Redirect">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { pathMatch } = route.params
router.replace({ path: typeof pathMatch === 'string' ? `/${pathMatch}` : `/${pathMatch.join('/')}` })
</script>