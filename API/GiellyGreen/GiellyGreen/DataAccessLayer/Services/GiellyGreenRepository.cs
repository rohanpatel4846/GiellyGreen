using DataAccessLayer.Interface;
using DataAccessLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Services
{
    public class GiellyGreenRepository : IGiellyGreen
    {
        public GiellyGreen_RohanEntities giellyGreenDataAccess = new GiellyGreen_RohanEntities();

        public List<GetImage_Result> GetImages(int id = 0)
        {
            var imageList = giellyGreenDataAccess.GetImage(id).ToList();
            return imageList;
        }

        public int PostImages(int id, string url)
        {
            var queryResult = giellyGreenDataAccess.InsertUpdateImage(id, url);

            foreach (Nullable<int> result in queryResult)
                return result.Value;

            return 0;
        }

        public List<GETSuppliers_Result> GetSuppliers(int id = 0, bool onlyActive = false)
        {
            var result = giellyGreenDataAccess.GETSuppliers(id, onlyActive).ToList();
            return result;
        }

        public int PostPutSuppliers(Supplier supplier)
        {
            var result = giellyGreenDataAccess.InsertUpdateSupplier(
                id: supplier.id,
                supplierName: supplier.SupplierName,
                supplierReferenceNumber: supplier.SupplierReferenceNumber,
                businessAddress: supplier.BusinessAddress,
                emailAddress: supplier.EmailAddress,
                phoneNumber: supplier.PhoneNumber,
                companyRegisterNumber: supplier.CompanyRegisterNumber,
                vATNumber: supplier.VATNumber,
                tAXReference: supplier.TAXReference,
                companyRegisteredAddress: supplier.CompanyRegisteredAddress,
                isActive: supplier.isActive,
                imageId:supplier.ImageId);

            return result;
        }

        public int PatchActiveSuppliers(int id, bool isActive)
        {
            var result = giellyGreenDataAccess.PatchActiveSupplier(id, isActive);
            return result;
        }

        public int DeleteSupplier(int id)
        {
            var result = giellyGreenDataAccess.DeleteSupplier(id,0);
            return result;
        }

        public List<GETMonthInvoice_Result> GetMonthInvoice(int id = 0)
        {
            var monthInvoiceList = giellyGreenDataAccess.GETMonthInvoice(id).ToList();
            return monthInvoiceList;
        }

        public int PostPutMonthInvoice(MonthInvoice monthInvoiceOBJ)
        {
            var result = giellyGreenDataAccess.InsertUpdateMonthInvoice(
                id: monthInvoiceOBJ.id,
                monthNUM: monthInvoiceOBJ.monthNUM,
                yearNUM: monthInvoiceOBJ.yearNUM,
                custom1_Name: monthInvoiceOBJ.Custom1_Name,
                custom2_Name: monthInvoiceOBJ.Custom2_Name,
                custom3_Name: monthInvoiceOBJ.Custom3_Name,
                custom4_Name: monthInvoiceOBJ.Custom4_Name,
                custom5_Name: monthInvoiceOBJ.Custom5_Name,
                invoiceDate: monthInvoiceOBJ.InvoiceDate,
                vAT: monthInvoiceOBJ.VAT,
                invoiceReferenceNumber: monthInvoiceOBJ.InvoiceReferenceNumber
            );

            return result;
        }

        public List<GETInvoice_Result> GetInvoice(int id = 0, int monthInvoiceId = 0)
        {
            var invoiceList = giellyGreenDataAccess.GETInvoice(id, monthInvoiceId).ToList();
            return invoiceList;
        }

        public int PostPutInvoice(Invoice invoice)
        {
            var result = giellyGreenDataAccess.InsertUpdateInvoice(
                id: invoice.id,
                monthId: invoice.MonthId,
                supplierId: invoice.SupplierId,
                hairService: invoice.HairService,
                beautyService: invoice.BeautyService,
                custom1: invoice.Custom1,
                custom2: invoice.Custom2,
                custom3: invoice.Custom3,
                custom4: invoice.Custom4,
                custom5: invoice.Custom5,
                advancePay: invoice.AdvancePay,
                isApproved: invoice.isApproved
            );

            return result;
        }
    }
}
