using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GiellyGreen.Models.Image
{
    public class ImageUploaderViewModel
    {
        [Required]
        public String Image64STR { get; set; }
        [Required]
        public String ImageType { get; set; }
    }
}