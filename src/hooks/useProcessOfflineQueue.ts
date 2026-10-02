import { useOfflineSync } from '@/utils/pwa';
import { useReports } from '@/hooks/useReports';
import { uploadReportPhoto, uploadAnnotatedPhoto } from '@/lib/storage';
import { displayName } from '@/services/reportService';
import { mockReverseGeocode } from '@/services/geocodeService';
import { useToast } from '@/hooks/useToast';

export function useProcessOfflineQueue() {
  const { addReport } = useReports();
  const toast = useToast();

  useOfflineSync(async (payload) => {
    const { draft, user, profile, finalScope } = payload;
    
    try {
      const photoUrl = await uploadReportPhoto(draft.photo, user.id);
      let annotatedUrl: string | null = null;
      if (draft.analysis?.annotatedImage) {
        try {
          annotatedUrl = await uploadAnnotatedPhoto(draft.analysis.annotatedImage, user.id);
        } catch {
          annotatedUrl = draft.analysis.annotatedImage;
        }
      }
      
      await addReport({
        title: draft.title,
        description: draft.description,
        coordinates: draft.coordinates,
        locationName: draft.locationName || mockReverseGeocode(draft.coordinates),
        category: draft.category,
        severity: draft.analysis.severity,
        photoUrl,
        author: displayName(profile),
        userId: user.id,
        scope: finalScope,
        ai: {
          confidence: draft.analysis.confidence,
          objects: draft.analysis.objects,
          summary: draft.analysis.description,
          model:
            draft.analysis.engine === 'roboflow'
              ? 'roboflow-detector'
              : draft.analysis.engine === 'ondevice'
                ? 'transformers.js-ondevice'
                : draft.analysis.engine === 'huggingface'
                  ? 'huggingface-inference'
                  : 'mock-vision-v2.4',
          imageQuality: draft.analysis.imageQuality ?? null,
          disclaimer: 'AI confidence is an estimate and may be inaccurate. Verify the issue before acting.',
          annotatedImage: annotatedUrl || draft.analysis.annotatedImage || null,
          originalImage: photoUrl,
        },
      });
      toast.success('Offline report synced', `Your report "${draft.title}" has been successfully uploaded.`);
    } catch (err) {
      console.error('Failed to sync offline report', err);
      throw err; // Throw to keep it in the queue
    }
  });
}
