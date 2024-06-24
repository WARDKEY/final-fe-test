<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h4" style="opacity: 0.4">
        원하시는 페이지를 찾을 수 없어요.
        <br />
        <br />
        너겟을 이용해주셔서 감사합니다.
        <br />
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="KnowGet 으로 다시 돌아가기"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'ErrorNotFound',
});
</script>
