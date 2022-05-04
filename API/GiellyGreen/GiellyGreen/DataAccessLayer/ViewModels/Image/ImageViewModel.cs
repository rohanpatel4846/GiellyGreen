using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GiellyGreen.Models.Image
{
    public class ImageViewModel
    {
        public int id { get; set; } = 0;
        [Required]
        public string url { get; set; }
    }
}