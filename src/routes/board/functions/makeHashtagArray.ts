import { HashtagService } from '../../hashtag/hashtag.service';
import { Hashtag } from '../../../entities/Hashtag.entity';

export async function makeHashtagArray(hashtags: string[], hashtagService: HashtagService) {
  const hashtagArray: (Hashtag | null)[] = await hashtagService.findHashtags(hashtags);
  const notCreatedHashtagArray: { name: string; error: string }[] = [];
  const newHashtags: Hashtag[] = [];

  for (const i in hashtagArray) {
    if (hashtagArray[i] === null) {
      try {
        console.log(hashtags[i]);
        const newHashtag: Hashtag = await hashtagService.create({ name: hashtags[i] });
        hashtagArray[i] = newHashtag;
        newHashtags.push(newHashtag);
      } catch (error: any) {
        notCreatedHashtagArray.push({ name: hashtags[i], error: error.message });
      }
    }
  }

  return {
    Hashtags: hashtagArray.filter((hashtag) => hashtag !== null),
    newHashtags: newHashtags,
    notCreatedHashtags: notCreatedHashtagArray,
  };
}
