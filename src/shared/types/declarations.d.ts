declare module 'vue-responsive-video-background-player' {
  import type { DefineComponent } from 'vue';

  const VideoBackground: DefineComponent<
    {
      src: string;
      poster?: string;
      overlay?: string;
    },
    unknown,
    unknown
  >;

  export default VideoBackground;
}
