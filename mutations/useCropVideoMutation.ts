import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { CroppedVideo } from "@store/createVideoSlice";
import { useBoundStore } from "@store/useBoundStore";
import { CropParams, cropWithFFMPEG } from "@helpers/cropWithFFMPEG";
import { generateThumbnail } from "@helpers/generateThumbnail";
import { router } from "expo-router";

interface MutationOutput {
  outputUri: string;
  thumbnailUri: string | null;
}

export function useCropVideoMutation(): UseMutationResult<
  MutationOutput,
  Error,
  CropParams
> {
  const addCroppedVideo = useBoundStore(
    (state: { addCroppedVideo: (video: CroppedVideo) => void }) =>
      state.addCroppedVideo
  );

  const cleanSelectedVideo = useBoundStore(
    (state: { cleanSelectedVideo: () => void }) => state.cleanSelectedVideo
  );
  const cleanBoth = useBoundStore(
    (state: { cleanBoth: () => void }) => state.cleanBoth
  );

  const videoName = useBoundStore((state) => state.videoName);
  const videoDescription = useBoundStore((state) => state.videoDescription);

  return useMutation<MutationOutput, Error, CropParams>({
    mutationFn: async (params: CropParams): Promise<MutationOutput> => {
      const outputUri = await cropWithFFMPEG(params);
      const thumbnailUri = await generateThumbnail(outputUri, 0);
      return {
        outputUri,
        thumbnailUri,
      };
    },
    onSuccess: (data: MutationOutput, variables: CropParams) => {
      addCroppedVideo({
        id: variables.id,
        uri: data.outputUri,
        thumbnail: data.thumbnailUri,
        name: videoName,
        description: videoDescription,
      });
      router.dismissAll();
      cleanSelectedVideo();
      cleanBoth();
    },
    onError: (error: Error) => {
      console.error("Video cropping process error:", error);
    },
  });
}
