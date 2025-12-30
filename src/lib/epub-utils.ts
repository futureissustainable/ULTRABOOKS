import JSZip from 'jszip';

/**
 * Extract cover image from an EPUB file
 * EPUBs are ZIP files containing an OPF file that references the cover image
 */
export async function extractEpubCover(file: File): Promise<Blob | null> {
  try {
    const zip = await JSZip.loadAsync(file);

    // First, find the container.xml to get the OPF file path
    const containerXml = await zip.file('META-INF/container.xml')?.async('text');
    if (!containerXml) {
      return null;
    }

    // Parse container.xml to find OPF path
    const opfPathMatch = containerXml.match(/full-path="([^"]+\.opf)"/i);
    if (!opfPathMatch) {
      return null;
    }

    const opfPath = opfPathMatch[1];
    const opfDir = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);

    // Read the OPF file
    const opfContent = await zip.file(opfPath)?.async('text');
    if (!opfContent) {
      return null;
    }

    // Try to find cover image reference in multiple ways
    let coverPath: string | null = null;

    // Method 1: Look for meta cover element
    const metaCoverMatch = opfContent.match(/<meta[^>]*name="cover"[^>]*content="([^"]+)"[^>]*\/?>/i);
    if (metaCoverMatch) {
      const coverId = metaCoverMatch[1];
      // Find the manifest item with this id
      const itemMatch = opfContent.match(new RegExp(`<item[^>]*id="${coverId}"[^>]*href="([^"]+)"[^>]*\\/?>`));
      if (itemMatch) {
        coverPath = itemMatch[1];
      }
    }

    // Method 2: Look for item with properties="cover-image"
    if (!coverPath) {
      const coverImageMatch = opfContent.match(/<item[^>]*properties="cover-image"[^>]*href="([^"]+)"[^>]*\/?>/i);
      if (coverImageMatch) {
        coverPath = coverImageMatch[1];
      }
    }

    // Method 3: Look for item with id containing "cover" and image media type
    if (!coverPath) {
      const coverItemMatch = opfContent.match(/<item[^>]*id="[^"]*cover[^"]*"[^>]*href="([^"]+)"[^>]*media-type="image\/[^"]+"/i);
      if (coverItemMatch) {
        coverPath = coverItemMatch[1];
      }
    }

    // Method 4: Look for any reference with "cover" in the href and image extension
    if (!coverPath) {
      const coverHrefMatch = opfContent.match(/<item[^>]*href="([^"]*cover[^"]*\.(jpg|jpeg|png|gif|webp))"[^>]*\/?>/i);
      if (coverHrefMatch) {
        coverPath = coverHrefMatch[1];
      }
    }

    if (!coverPath) {
      return null;
    }

    // Resolve the full path to the cover image
    const fullCoverPath = coverPath.startsWith('/')
      ? coverPath.slice(1)
      : opfDir + coverPath;

    // Extract the cover image
    const coverFile = zip.file(fullCoverPath) || zip.file(coverPath);
    if (!coverFile) {
      return null;
    }

    const coverData = await coverFile.async('blob');

    // Determine the MIME type from the file extension
    const ext = coverPath.toLowerCase().split('.').pop();
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
    };

    const mimeType = mimeTypes[ext || ''] || 'image/jpeg';

    return new Blob([coverData], { type: mimeType });
  } catch {
    return null;
  }
}

/**
 * Extract metadata (title, author) from an EPUB file
 */
export async function extractEpubMetadata(file: File): Promise<{ title?: string; author?: string }> {
  try {
    const zip = await JSZip.loadAsync(file);

    // Find the container.xml to get the OPF file path
    const containerXml = await zip.file('META-INF/container.xml')?.async('text');
    if (!containerXml) {
      return {};
    }

    const opfPathMatch = containerXml.match(/full-path="([^"]+\.opf)"/i);
    if (!opfPathMatch) {
      return {};
    }

    const opfContent = await zip.file(opfPathMatch[1])?.async('text');
    if (!opfContent) {
      return {};
    }

    const metadata: { title?: string; author?: string } = {};

    // Extract title
    const titleMatch = opfContent.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/i);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }

    // Extract author
    const authorMatch = opfContent.match(/<dc:creator[^>]*>([^<]+)<\/dc:creator>/i);
    if (authorMatch) {
      metadata.author = authorMatch[1].trim();
    }

    return metadata;
  } catch {
    return {};
  }
}
