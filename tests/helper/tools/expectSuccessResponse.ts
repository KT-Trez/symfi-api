export default function expectSuccessResponse(res: any, status: number) {
	res.should.have.status(status);
	res.body.should.be.a('object');
	res.body.should.have.property('success').to.be.true;
};